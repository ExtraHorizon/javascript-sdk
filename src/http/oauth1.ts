import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ConfigOauth1 } from '../types';
import { TokenDataOauth1, OAuth1Config, OAuthClient, MfaConfig } from './types';
import {
  camelizeResponseData,
  retryInterceptor,
  transformKeysResponseData,
  transformResponseData,
} from './interceptors';
import { typeReceivedError } from '../errorHandler';
import { USER_BASE } from '../constants';

export function createOAuth1HttpClient(
  http: AxiosInstance,
  options: ConfigOauth1
): OAuthClient {
  let tokenData: TokenDataOauth1;

  const httpWithAuth = axios.create({ ...http.defaults });

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

  async function setTokenData(data: TokenDataOauth1) {
    if (options.freshTokensCallback) {
      await options.freshTokensCallback(data);
    }
    tokenData = data;
  }

  httpWithAuth.interceptors.request.use(async (config = {}) => ({
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'application/json',
      ...(config?.method
        ? options.oauth1.toHeader(
            options.oauth1.authorize(
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
        const path = `${USER_BASE}/me`;
        await http.get(path, {
          headers: {
            'Content-Type': 'application/json',
            ...options.oauth1.toHeader(
              options.oauth1.authorize(
                {
                  url: options.host + path,
                  method: 'get',
                },
                tokenData
              )
            ),
          },
        });
      }
      return tokenData;
    }

    const tokenResult = await http.post(options.path, data.params, {
      headers: {
        'Content-Type': 'application/json',
        ...options.oauth1.toHeader(
          options.oauth1.authorize({
            url: options.host + options.path,
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

    setTokenData(tokenResultData);
    return tokenResultData;
  }

  async function confirmMfa({
    token,
    methodId,
    code,
  }: MfaConfig): Promise<TokenDataOauth1> {
    const tokenResult = await http.post(
      `${options.path}/mfa`,
      {
        token,
        code,
        methodId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...options.oauth1.toHeader(
            options.oauth1.authorize({
              url: `${options.host}${options.path}/mfa`,
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

    setTokenData(tokenResultData);
    return tokenResultData;
  }

  function logout(): boolean {
    tokenData = null;
    return true;
  }

  return {
    ...httpWithAuth,
    authenticate,
    confirmMfa,
    logout,
    get userId() {
      return tokenData?.userId;
    },
  };
}
