/* eslint-disable no-underscore-dangle */
import * as AxiosLogger from 'axios-logger';

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from '../types';
import { TokenDataOauth2 } from './types';
import { camelizeResponseData } from './utils';

export const addAuth = (
  http: AxiosInstance,
  options: Config,
  authConfig: Record<string, any>
) => {
  let tokenData: TokenDataOauth2;
  const httpWithAuth = axios.create({ ...http.defaults });

  if (options.debug) {
    httpWithAuth.interceptors.request.use(AxiosLogger.requestLogger);
    httpWithAuth.interceptors.response.use(AxiosLogger.responseLogger);
  }

  const refreshTokens = async () => {
    const tokenResult = await http.post(authConfig.path, {
      grant_type: 'refresh_token',
      refresh_token: tokenData.refreshToken,
    });
    tokenData = tokenResult.data;
    return tokenData;
  };

  const authenticate = async () => {
    const tokenResult = await http.post(authConfig.path, authConfig.params);
    tokenData = tokenResult.data;
    return tokenData;
  };

  httpWithAuth.interceptors.request.use(async config => ({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${
        (tokenData && tokenData.accessToken) ||
        (await authenticate()).accessToken
      }`,
    },
  }));

  httpWithAuth.interceptors.response.use(res => res);

  httpWithAuth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      const originalRequest = error.config;
      if (
        error.response &&
        (error.response.status === 403 || error.response.status === 401) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        tokenData.accessToken = '';
        if (error.response.code === 118) {
          // ACCESS_TOKEN_EXPIRED_EXCEPTION
          originalRequest.headers.Authorization = `Bearer ${
            (await refreshTokens()).accessToken
          }`;
        } else {
          // All others, retry authenticate
          originalRequest.headers.Authorization = `Bearer ${
            (await authenticate()).accessToken
          }`;
        }
        return http(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  httpWithAuth.interceptors.response.use(camelizeResponseData);

  return httpWithAuth;
};
