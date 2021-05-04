import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from '../types';
import { TokenDataOauth1, OAuth1Config } from './types';
import {
  camelizeResponseData,
  transformKeysResponseData,
  transformResponseData,
} from './interceptors';
import { typeReceivedError } from '../errorHandler';
import { USER_BASE } from '../constants';

export function createOAuth1HttpClient(http: AxiosInstance, options: Config) {
  let tokenData: TokenDataOauth1;
  let authConfig;

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

  httpWithAuth.interceptors.request.use(async config => ({
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'application/json',
      ...authConfig.oauth1.toHeader(
        authConfig.oauth1.authorize(
          {
            url: config.baseURL + config.url,
            method: config.method,
          },
          tokenData
        )
      ),
    },
  }));

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

  async function authenticate(data: OAuth1Config) {
    // If the user has passed in a token/tokenSecret combination.
    // Validate it against /users/me
    authConfig = data;
    if ('tokenData' in data) {
      tokenData = data.tokenData;
      const path = `${USER_BASE}/me`;
      await http.get(path, {
        headers: {
          'Content-Type': 'application/json',
          ...authConfig.oauth1.toHeader(
            authConfig.oauth1.authorize(
              {
                url: options.apiHost + path,
                method: 'get',
              },
              tokenData
            )
          ),
        },
      });
    } else {
      const tokenResult = await http.post(authConfig.path, authConfig.params, {
        headers: {
          'Content-Type': 'application/json',
          ...authConfig.oauth1.toHeader(
            authConfig.oauth1.authorize({
              url: options.apiHost + authConfig.path,
              method: 'POST',
            })
          ),
        },
      });
      setTokenData({
        ...tokenResult.data,
        key: tokenResult.data.token,
        secret: tokenResult.data.tokenSecret,
      });
    }
  }

  async function confirmMfa({
    token,
    methodId,
    code,
  }: {
    token: string;
    methodId: string;
    code: string;
  }) {
    const tokenResult = await http.post(
      `${authConfig.path}/mfa`,
      {
        token,
        code,
        methodId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...authConfig.oauth1.toHeader(
            authConfig.oauth1.authorize({
              url: `${options.apiHost}${authConfig.path}/mfa`,
              method: 'POST',
            })
          ),
        },
      }
    );
    setTokenData({
      ...tokenResult.data,
      key: tokenResult.data.token,
      secret: tokenResult.data.tokenSecret,
    });
  }

  return { ...httpWithAuth, authenticate, confirmMfa };
}
