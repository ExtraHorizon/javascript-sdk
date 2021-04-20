/* eslint-disable no-underscore-dangle */
import * as AxiosLogger from 'axios-logger';

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from '../types';
import { AuthConfig, TokenDataOauth2 } from './types';
import { camelizeResponseData, transformResponseData } from './utils';
import { typeReceivedError } from '../errorHandler';

export default (http: AxiosInstance, options: Config) => {
  let tokenData: TokenDataOauth2;
  let authConfig;
  const httpWithAuth = axios.create({ ...http.defaults });

  if (options.debug) {
    httpWithAuth.interceptors.request.use(AxiosLogger.requestLogger);
    httpWithAuth.interceptors.response.use(AxiosLogger.responseLogger);
  }

  const refreshTokens = async () => {
    try {
      const tokenResult = await http.post(authConfig.path, {
        grant_type: 'refresh_token',
        refresh_token: tokenData.refreshToken,
      });
      setTokenData(tokenResult.data);
      return tokenResult.data;
    } catch (error) {
      throw typeReceivedError(error);
    }
  };

  httpWithAuth.interceptors.request.use(async config => ({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${tokenData && tokenData.accessToken}`,
    },
  }));

  httpWithAuth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      // Only needed if it's an axiosError, otherwise it's already typed
      if (error && error.isAxiosError) {
        const originalRequest = error.config;
        if (
          error.response &&
          [400, 401, 403].includes(error.response.status) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          if (
            error.response?.data?.code === 118 ||
            // ACCESS_TOKEN_EXPIRED_EXCEPTION
            error.response?.data?.code === 117
            // ACCESS_TOKEN_UNKNOWN
          ) {
            tokenData.accessToken = '';
            originalRequest.headers.Authorization = `Bearer ${
              (await refreshTokens()).accessToken
            }`;
          } else {
            return Promise.reject(typeReceivedError(error));
          }
          return http(originalRequest);
        }

        return Promise.reject(typeReceivedError(error));
      }
      return Promise.reject(error);
    }
  );

  httpWithAuth.interceptors.response.use(camelizeResponseData);
  httpWithAuth.interceptors.response.use(transformResponseData);

  async function setTokenData(data: TokenDataOauth2) {
    if (options.freshTokensCallback) {
      await options.freshTokensCallback(data);
    }
    tokenData = data;
  }

  async function authenticate(data: AuthConfig) {
    try {
      authConfig = data;
      const tokenResult = await http.post(authConfig.path, authConfig.params);
      setTokenData(tokenResult.data);
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
      const tokenResult = await http.post(authConfig.path, {
        ...authConfig.params,
        grant_type: 'mfa',
        token,
        code,
        method_id: methodId,
      });
      setTokenData(tokenResult.data);
    } catch (error) {
      throw typeReceivedError(error);
    }
  }

  return { ...httpWithAuth, authenticate, confirmMfa };
};
