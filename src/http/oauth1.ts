import axios from 'axios';
import * as qs from 'qs';
import { HmacSHA1 } from 'crypto-es/lib/sha1';
import { Base64 } from 'crypto-es/lib/enc-base64';
import { Oauth1AuthParams, ParamsOauth1 } from '../types';
import {
  TokenDataOauth1,
  MfaConfig,
  HttpInstance,
  OAuth1HttpClient,
} from './types';
import {
  camelizeResponseData,
  retryInterceptor,
  transformKeysResponseData,
  transformResponseData,
  typeReceivedErrorsInterceptor,
} from './interceptors';
import { AUTH_BASE, USER_BASE } from '../constants';

const TOKEN_ENDPOINT = `${AUTH_BASE}/oauth1/tokens`;

export function createOAuth1HttpClient(
  http: HttpInstance,
  options: ParamsOauth1
): OAuth1HttpClient {
  const consumer = {
    key: options.consumerKey,
    secret: options.consumerSecret,
  };

  let tokenData: TokenDataOauth1;
  if ('token' in options && 'tokenSecret' in options) {
    tokenData = {
      key: options.token,
      secret: options.tokenSecret,
    };
  }

  const httpWithAuth = axios.create({
    ...http.defaults,
    headers: {},
  });

  httpWithAuth.defaults.headers = http.defaults.headers;

  const { requestLogger, responseLogger } = options;

  async function getMe() {
    const path = `${USER_BASE}/me`;
    const { data: me } = await http.get(path, {
      headers: {
        'Content-Type': 'application/json',
        ...getOAuth1AuthorizationHeader({
          url: options.host + path,
          method: 'get',
          consumer,
          tokenData,
        }),
      },
    });
    return me;
  }

  if (requestLogger) {
    httpWithAuth.interceptors.request.use(
      config => {
        requestLogger(config);
        return config;
      },
      error => {
        requestLogger(error);
        return Promise.reject(error);
      }
    );
  }

  if (responseLogger) {
    httpWithAuth.interceptors.response.use(
      response => {
        responseLogger(response);
        return response;
      },
      error => {
        responseLogger(error);
        return Promise.reject(error);
      }
    );
  }

  async function setTokenData(data: TokenDataOauth1) {
    tokenData = data;
  }

  httpWithAuth.interceptors.request.use(async (config = {}) => ({
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'application/json',
      ...(config?.method
        ? getOAuth1AuthorizationHeader({
            url: `${config.baseURL}${config.url}`,
            method: config.method,
            consumer,
            tokenData,
          })
        : {}),
    },
  }));

  httpWithAuth.interceptors.response.use(null, retryInterceptor(httpWithAuth));
  httpWithAuth.interceptors.response.use(null, typeReceivedErrorsInterceptor);

  httpWithAuth.interceptors.response.use(camelizeResponseData);
  httpWithAuth.interceptors.response.use(transformResponseData);
  httpWithAuth.interceptors.response.use(transformKeysResponseData);

  async function authenticate(
    data: Oauth1AuthParams
  ): Promise<TokenDataOauth1> {
    // If the user has passed in a token/tokenSecret combination.
    // Validate it against /users/me on the unauthenticated Axios client unless skipTokenCheck is true

    if ('tokenSecret' in data) {
      tokenData = {
        key: data.token,
        secret: data.tokenSecret,
      };

      if (!data.skipTokenCheck) {
        const me = await getMe();
        tokenData.userId = me.id;
      }

      return tokenData;
    }

    const loginData = {
      email: data.email,
      password: data.password,
    };

    const tokenResult = await http.post(TOKEN_ENDPOINT, loginData, {
      headers: {
        'Content-Type': 'application/json',
        ...getOAuth1AuthorizationHeader({
          url: options.host + TOKEN_ENDPOINT,
          method: 'POST',
          consumer,
        }),
      },
    });

    const tokenResultData = {
      ...tokenResult.data,
      key: tokenResult.data.token,
      secret: tokenResult.data.tokenSecret,
    };

    await setTokenData(tokenResultData);
    return tokenResultData;
  }

  async function confirmMfa({
    token,
    methodId,
    code,
  }: MfaConfig): Promise<TokenDataOauth1> {
    const tokenResult = await http.post(
      `${TOKEN_ENDPOINT}/mfa`,
      {
        token,
        code,
        methodId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...getOAuth1AuthorizationHeader({
            url: `${options.host}${TOKEN_ENDPOINT}/mfa`,
            method: 'POST',
            consumer,
          }),
        },
      }
    );

    const tokenResultData = {
      ...tokenResult.data,
      key: tokenResult.data.token,
      secret: tokenResult.data.tokenSecret,
    };

    await setTokenData(tokenResultData);
    return tokenResultData;
  }

  function logout(): boolean {
    tokenData = null;
    return true;
  }

  /*
   * The default way of adding a getter does not seem to work well with RN at
   * the moment. This way always works.
   */
  return Object.defineProperty(
    {
      ...httpWithAuth,
      extraAuthMethods: {
        authenticate,
        confirmMfa,
        logout,
      },
    },
    'userId',
    {
      get() {
        return (async () => {
          try {
            if (!tokenData?.userId) {
              const me = await getMe();
              tokenData = { ...tokenData, userId: me.id };
              return me.id;
            }
            return tokenData?.userId;
          } catch (e) {
            return undefined;
          }
        })();
      },
    }
  ) as OAuth1HttpClient;
}
interface getOAuth1AuthorizationHeaderInput {
  method: string;
  url: string;
  consumer: { key: string; secret: string };
  tokenData?: Pick<TokenDataOauth1, 'key' | 'secret'>;
}

function getOAuth1AuthorizationHeader({
  method,
  url,
  consumer,
  tokenData,
}: getOAuth1AuthorizationHeaderInput) {
  const { baseUrl, searchParameters } = getUrlInfoFromRequest(url);

  const nonce = generateNonce();
  const timeStamp = getTimeStamp();

  const parameters = {
    oauth_consumer_key: consumer.key,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_token: tokenData.key,
    oauth_timestamp: timeStamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
  };

  if (!parameters.oauth_token) {
    delete parameters.oauth_token;
  }

  const signatureParameters = {
    ...searchParameters,
    ...parameters,
  };

  const signature = sign(
    method,
    baseUrl,
    signatureParameters,
    consumer.secret,
    tokenData.secret
  );

  const header = toHeader({
    oauth_signature: signature,
    ...parameters,
  });

  return header;
}

function sign(
  httpMethod: string,
  baseUri: string,
  params,
  consumerSecret: string,
  tokenSecret: string
) {
  const base = generateBase(httpMethod, baseUri, params);
  const key = [consumerSecret || '', tokenSecret || '']
    .map(percentEncode)
    .join('&');

  return hmacSha1Hash(base, key);
}

function generateBase(httpMethod: string, baseUri: string, params) {
  // adapted from https://dev.twitter.com/docs/auth/oauth and
  // https://dev.twitter.com/docs/auth/creating-signature

  // Parameter normalization
  // http://tools.ietf.org/html/rfc5849#section-3.4.1.3.2
  const normalized = map(params)
    // 1.  First, the name and value of each parameter are encoded
    .map(p => [percentEncode(p[0]), percentEncode(p[1] || '')])
    // 2.  The parameters are sorted by name, using ascending byte value
    //     ordering.  If two or more parameters share the same name, they
    //     are sorted by their value.
    .sort((a, b) => compare(a[0], b[0]) || compare(a[1], b[1]))
    // 3.  The name of each parameter is concatenated to its corresponding
    //     value using an "=" character (ASCII code 61) as a separator, even
    //     if the value is empty.
    .map(p => p.join('='))
    // 4.  The sorted name/value pairs are concatenated together into a
    //     single string by using an "&" character (ASCII code 38) as
    //     separator.
    .join('&');

  const base = [
    percentEncode(httpMethod ? httpMethod.toUpperCase() : 'GET'),
    percentEncode(baseUri),
    percentEncode(normalized),
  ].join('&');

  return base;
}

function hmacSha1Hash(baseString: string, key: string) {
  return HmacSHA1(baseString, key).toString(Base64);
}

// Maps object to bi-dimensional array
// Converts { foo: 'A', bar: [ 'b', 'B' ]} to
// [ ['foo', 'A'], ['bar', 'b'], ['bar', 'B'] ]
function map(obj) {
  const arr = [];
  for (const [key, val] of Object.entries(obj)) {
    if (Array.isArray(val))
      for (let i = 0; i < val.length; i += 1) arr.push([key, val[i]]);
    else if (typeof val === 'object')
      for (const [propKey, propValue] of Object.entries(val)) {
        arr.push([`${key}[${propKey}]`, propValue]);
      }
    else arr.push([key, val]);
  }
  return arr;
}

// Compare function for sort
function compare(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

function getUrlInfoFromRequest(url: string) {
  const { protocol, host, pathname, search } = new URL(url);

  return {
    baseUrl: `${protocol}//${host}${pathname}`,
    searchParameters: qs.parse(
      search.startsWith('?') ? search.slice(1) : search
    ),
  };
}

function generateNonce() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let result = '';
  for (let i = 0; i < 32; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

function getTimeStamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function toHeader(oAuthData) {
  const parameterSeparator = ', ';
  const keys = Object.keys(oAuthData).sort();

  let headerValue = 'OAuth ';

  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i].indexOf('oauth_') !== 0) continue;

    headerValue += `${percentEncode(keys[i])}="${percentEncode(
      oAuthData[keys[i]]
    )}"${parameterSeparator}`;
  }

  return {
    Authorization: headerValue.substr(
      0,
      headerValue.length - parameterSeparator.length
    ),
  };
}

function percentEncode(str: string) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}
