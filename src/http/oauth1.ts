import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from '../types';
import { TokenDataOauth1, Oauth1Config } from './types';
import {
  camelizeResponseData,
  transformKeysResponseData,
  transformResponseData,
} from './interceptors';
import { typeReceivedError } from '../errorHandler';

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
        return error;
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
        return error;
      }
    );
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

  async function authenticate(data: Oauth1Config) {
    try {
      authConfig = data;

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
      tokenData = {
        ...tokenResult.data,
        key: tokenResult.data.token,
        secret: tokenResult.data.tokenSecret,
      };
    } catch (error) {
      throw typeReceivedError(error);
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
    try {
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
      tokenData = {
        ...tokenResult.data,
        key: tokenResult.data.token,
        secret: tokenResult.data.tokenSecret,
      };
    } catch (error) {
      throw typeReceivedError(error);
    }
  }

  return { ...httpWithAuth, authenticate, confirmMfa };
}
