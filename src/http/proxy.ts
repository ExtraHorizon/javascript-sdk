import axios, { AxiosResponse } from 'axios';
import { USER_BASE } from '../constants';
import { ParamsProxy } from '../types';
import { AuthHttpClient, HttpInstance, ProxyInstance } from './types';
import {
  camelizeResponseData,
  retryInterceptor,
  transformKeysResponseData,
  transformResponseData,
} from './interceptors';
import { typeReceivedError } from '../errorHandler';

export function createProxyHttpClient(
  http: HttpInstance,
  options: ParamsProxy
): AuthHttpClient {
  const httpWithAuth = axios.create({
    ...http.defaults,
    headers: {},
    withCredentials: true,
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

  httpWithAuth.interceptors.response.use(null, retryInterceptor(httpWithAuth));

  httpWithAuth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      // Only needed if it's an axiosError, otherwise it's already typed
      if (error && error.isAxiosError) {
        return Promise.reject(typeReceivedError({ ...error, type: 'proxy' }));
      }
      return Promise.reject(error);
    }
  );

  httpWithAuth.interceptors.response.use(camelizeResponseData);
  httpWithAuth.interceptors.response.use(transformResponseData);
  httpWithAuth.interceptors.response.use(transformKeysResponseData);

  async function logout(): Promise<boolean> {
    try {
      await httpWithAuth.post(`/logout`);
      return true;
    } catch (err) {
      return false;
    }
  }

  /*
   * The default way of adding a getter does not seem to work well with RN at
   * the moment. This way always works.
   */
  return Object.defineProperty(
    {
      ...httpWithAuth,
      logout,
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
  ) as ProxyInstance;
}
