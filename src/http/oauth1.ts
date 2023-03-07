import axios, { AxiosResponse } from 'axios';
import OAuth from 'oauth-1.0a';
import { HmacSHA1 } from 'crypto-es/lib/sha1';
import { Base64 } from 'crypto-es/lib/enc-base64';
import { ParamsOauth1 } from '../types';
import {
  TokenDataOauth1,
  OAuth1Config,
  OAuthClient,
  MfaConfig,
  HttpInstance,
} from './types';
import {
  camelizeResponseData,
  retryInterceptor,
  transformKeysResponseData,
  transformResponseData,
} from './interceptors';
import { typeReceivedError } from '../errorHandler';
import { AUTH_BASE, USER_BASE } from '../constants';

const TOKEN_ENDPOINT = `${AUTH_BASE}/oauth1/tokens`;

export function createOAuth1HttpClient(
  http: HttpInstance,
  options: ParamsOauth1
): OAuthClient {
  const oAuth = new OAuth({
    consumer: {
      key: options.consumerKey,
      secret: options.consumerSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: hmacSha1Hash,
  });

  let tokenData: TokenDataOauth1;

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
        ...oAuth.toHeader(
          oAuth.authorize(
            {
              url: options.host + path,
              method: 'get',
            },
            tokenData
          )
        ),
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
        ? oAuth.toHeader(
            oAuth.authorize(
              {
                url: `${config.baseURL}${config.url}`,
                method: config.method,
              },
              tokenData
            )
          )
        : {}),
    },
  }));

  httpWithAuth.interceptors.response.use(null, retryInterceptor(httpWithAuth));

  httpWithAuth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      // Only needed if it's an axiosError, otherwise it's already typed
      if (error && error.isAxiosError) {
        return Promise.reject(typeReceivedError(error));
      }
      return Promise.reject(error);
    }
  );

  httpWithAuth.interceptors.response.use(camelizeResponseData);
  httpWithAuth.interceptors.response.use(transformResponseData);
  httpWithAuth.interceptors.response.use(transformKeysResponseData);

  async function authenticate(data: OAuth1Config): Promise<TokenDataOauth1> {
    // If the user has passed in a token/tokenSecret combination.
    // Validate it against /users/me on the unauthenticated Axios client unless skipTokenCheck is true

    if ('tokenData' in data) {
      tokenData = data.tokenData;
      if (!data.skipTokenCheck) {
        const me = await getMe();
        tokenData = { ...data.tokenData, userId: me.id };
      }
      return tokenData;
    }

    const tokenResult = await http.post(TOKEN_ENDPOINT, data.params, {
      headers: {
        'Content-Type': 'application/json',
        ...oAuth.toHeader(
          oAuth.authorize({
            url: options.host + TOKEN_ENDPOINT,
            method: 'POST',
          })
        ),
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
          ...oAuth.toHeader(
            oAuth.authorize({
              url: `${options.host}${TOKEN_ENDPOINT}/mfa`,
              method: 'POST',
            })
          ),
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
      authenticate,
      confirmMfa,
      logout,
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
  ) as OAuthClient;
}

function hmacSha1Hash(baseString: string, key: string) {
  return HmacSHA1(baseString, key).toString(Base64);
}
