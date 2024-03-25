import axios from 'axios';
import btoa from '../btoa';
import { AUTH_BASE } from '../constants';
import { Oauth2AuthParams, ParamsOauth2 } from '../types';
import {
  camelizeResponseData,
  retryInterceptor,
  transformKeysResponseData,
  transformResponseData,
  typeReceivedErrorsInterceptor,
} from './interceptors';
import {
  HttpInstance,
  MfaConfig,
  OAuth2HttpClient,
  OidcAuthenticationUrl,
  OidcAuthenticationUrlRequest,
  TokenDataOauth2,
} from './types';

const TOKEN_ENDPOINT = `${AUTH_BASE}/oauth2/tokens`;

export function createOAuth2HttpClient(
  http: HttpInstance,
  options: ParamsOauth2
): OAuth2HttpClient {
  let tokenData: Partial<TokenDataOauth2>;

  if ('refreshToken' in options && 'accessToken' in options) {
    tokenData = {
      refreshToken: options.refreshToken,
      accessToken: options.accessToken,
    };

    if (options.expiresIn != null) {
      tokenData.expiresIn = options.expiresIn;
    }

    if (options.creationTimestamp) {
      if (options.creationTimestamp instanceof Date) {
        tokenData.creationTimestamp = options.creationTimestamp;
      } else {
        tokenData.creationTimestamp = new Date(options.creationTimestamp);
      }
    }
  }

  const clientCredentials = getClientCredentials(options);

  const httpWithAuth = axios.create({
    ...http.defaults,
    headers: {},
  });

  httpWithAuth.defaults.headers = http.defaults.headers;

  const { requestLogger, responseLogger } = options;
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

  // If set, add the access token to each request
  httpWithAuth.interceptors.request.use(async config => {
    if (!tokenData?.accessToken) {
      return config;
    }

    // If we have an estimate of when the token is about to expire, try to refresh before it expires
    if (tokenData.expiresIn && tokenData.creationTimestamp) {
      const expireTime = tokenData.creationTimestamp.getTime() + tokenData.expiresIn * 1000;

      // Refresh 10 seconds before the token is about to expire.
      // This is to prevent being just too late with a refresh of the token due to latencies
      if (Date.now() > expireTime - 10 * 1000) {
        await authenticate({ refreshToken: tokenData.refreshToken });
      }
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${tokenData.accessToken}`,
      },
    };
  });

  httpWithAuth.interceptors.response.use(null, retryInterceptor(httpWithAuth));

  // If we receive a expired/unknown access token error, refresh the tokens
  httpWithAuth.interceptors.response.use(null, async error => {
    if (!error || !error.isAxiosError || !error.response) {
      throw error;
    }

    const originalRequest = error.config;
    if (
      [400, 401, 403].includes(error.response.status) &&
      // ACCESS_TOKEN_EXPIRED_EXCEPTION or ACCESS_TOKEN_UNKNOWN_EXCEPTION
      [118, 117].includes(error.response?.data?.code) &&
      !originalRequest.isRetryWithRefreshedTokens
    ) {
      originalRequest.isRetryWithRefreshedTokens = true;
      await authenticate({ refreshToken: tokenData.refreshToken });
      return httpWithAuth(originalRequest);
    }

    throw error;
  });

  httpWithAuth.interceptors.response.use(null, typeReceivedErrorsInterceptor);

  httpWithAuth.interceptors.response.use(camelizeResponseData);
  httpWithAuth.interceptors.response.use(transformResponseData);
  httpWithAuth.interceptors.response.use(transformKeysResponseData);

  /**
   * - Adds a creationTimestamp to the token
   * - Notifies the user
   * - Stores the token to authenticate future requests
   * - Returns the token
   */
  async function dateAndSetTokenData(data: TokenDataOauth2) {
    const datedData = {
      ...data,
      creationTimestamp: new Date(),
    };

    if (options.freshTokensCallback) {
      await options.freshTokensCallback(datedData);
    }
    tokenData = datedData;

    return datedData;
  }

  async function authenticate(
    data: Oauth2AuthParams
  ): Promise<TokenDataOauth2> {
    const grantData = getGrantData(data);

    const tokenResult = await http.post(
      TOKEN_ENDPOINT,
      {
        ...clientCredentials,
        ...grantData,
      },
      clientCredentials.client_secret ?
        {
          auth: {
            username: clientCredentials.client_id,
            password: clientCredentials.client_secret,
          },
        } :
        {}
    );

    return await dateAndSetTokenData(tokenResult.data);
  }

  async function confirmMfa({
    token,
    methodId,
    code,
  }: MfaConfig): Promise<TokenDataOauth2> {
    const tokenResult = await http.post(
      TOKEN_ENDPOINT,
      {
        ...clientCredentials,
        grant_type: 'mfa',
        token,
        code,
        method_id: methodId,
      },
      clientCredentials.client_secret ?
        {
          auth: {
            username: clientCredentials.client_id,
            password: clientCredentials.client_secret,
          },
        } :
        {}
    );

    return await dateAndSetTokenData(tokenResult.data);
  }

  async function generateOidcAuthenticationUrl(
    providerName: string,
    data: OidcAuthenticationUrlRequest
  ): Promise<OidcAuthenticationUrl> {
    const response = await http.post(
      `${AUTH_BASE}/oidc/providers/${providerName}/generateAuthenticationUrl`,
      data
    );

    return response.data;
  }

  async function authenticateWithOidc(
    providerName: string,
    data: OidcAuthenticationUrlRequest
  ): Promise<TokenDataOauth2> {
    const response = await http.post(
      `${AUTH_BASE}/oidc/providers/${providerName}/oAuth2Login`,
      {
        ...clientCredentials,
        ...data,
      },
      clientCredentials.client_secret ?
        {
          auth: {
            username: clientCredentials.client_id,
            password: clientCredentials.client_secret,
          },
        } :
        {}
    );

    return await dateAndSetTokenData(response.data);
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
      normalizeCustomData: options.normalizeCustomData,
      ...httpWithAuth,
      extraAuthMethods: {
        authenticate,
        confirmMfa,
        logout,
        generateOidcAuthenticationUrl,
        authenticateWithOidc,
      },
    },
    'userId',
    {
      get() {
        return Promise.resolve(tokenData?.userId);
      },
    }
  ) as OAuth2HttpClient;
}

function getClientCredentials({ clientId, clientSecret }: ParamsOauth2) {
  const credentials: OAuth2ClientCredentials = {
    client_id: clientId,
  };

  if (clientSecret) {
    credentials.client_secret = clientSecret;

    /* Monkeypatch the btoa function. See https://github.com/ExtraHorizon/javascript-sdk/issues/446 */
    if (global && typeof global.btoa !== 'function') {
      global.btoa = btoa;
    }
  }

  return credentials;
}

interface OAuth2ClientCredentials {
  client_id: string;
  client_secret?: string;
}

function getGrantData(params: Oauth2AuthParams) {
  if ('username' in params) {
    return {
      grant_type: 'password',
      username: params.username,
      password: params.password,
    };
  }

  if ('code' in params) {
    return {
      grant_type: 'authorization_code',
      code: params.code,
    };
  }

  if ('refreshToken' in params) {
    return {
      grant_type: 'refresh_token',
      refresh_token: params.refreshToken,
    };
  }

  throw new Error('Invalid Oauth config');
}
