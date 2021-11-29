/* eslint-disable no-underscore-dangle */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { USER_BASE } from '../constants';
import { ConfigProxy } from '../types';
import { OAuthClient, AuthHttpClient } from './types';
import {
  camelizeResponseData,
  retryInterceptor,
  transformKeysResponseData,
  transformResponseData,
} from './interceptors';
import { typeReceivedError } from '../errorHandler';

export function createProxyHttpClient(
  http: AxiosInstance,
  options: ConfigProxy
): AuthHttpClient {
  const httpWithAuth = axios.create({
    ...http.defaults,
    withCredentials: true,
  });

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

  httpWithAuth.interceptors.response.use(null, retryInterceptor(httpWithAuth));

  httpWithAuth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      // Only needed if it's an axiosError, otherwise it's already typed
      if (error && error.isAxiosError) {
        if (error.response && [400, 401, 403].includes(error.response.status)) {
          if (
            error.response?.data?.code === 104 ||
            // UserNotAuthenticatedError
            error.response?.data?.code === 108
            // OauthTokenError
          ) {
            return Promise.reject(
              typeReceivedError({ ...error, type: 'proxy' })
            );
          }
          return Promise.reject(typeReceivedError(error));
        }

        return Promise.reject(typeReceivedError(error));
      }
      return Promise.reject(error);
    }
  );

  httpWithAuth.interceptors.response.use(camelizeResponseData);
  httpWithAuth.interceptors.response.use(transformResponseData);
  httpWithAuth.interceptors.response.use(transformKeysResponseData);

  /*
   * The default way of adding a getter does not seem to work well with RN at
   * the moment. This way always works.
   */
  return Object.defineProperty(
    {
      ...httpWithAuth,
    },
    'userId',
    {
      get() {
        return (async () => {
          try {
            const { data: me } = await httpWithAuth.get(`${USER_BASE}/me`);
            return me?.id;
          } catch (e) {
            return undefined;
          }
        })();
      },
    }
  ) as OAuthClient;
}
