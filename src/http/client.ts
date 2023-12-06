import axios from 'axios';
import { HttpClientConfig, HttpInstance } from '../types';
import {
  camelizeResponseData,
  retryInterceptor,
  transformKeysResponseData,
  transformResponseData,
  typeReceivedErrorsInterceptor,
} from './interceptors';
import { composeUserAgent } from './utils';

export function createHttpClient({
  packageVersion,
  host,
  requestLogger,
  responseLogger,
  headers = {},
}: HttpClientConfig): HttpInstance {
  const http = axios.create({
    baseURL: host,
    headers: {
      ...headers,
      'X-User-Agent': composeUserAgent(packageVersion),
    },
  });

  if (requestLogger) {
    http.interceptors.request.use(
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
    http.interceptors.response.use(
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

  http.interceptors.response.use(null, retryInterceptor(http));
  http.interceptors.response.use(null, typeReceivedErrorsInterceptor);

  http.interceptors.response.use(camelizeResponseData);
  http.interceptors.response.use(transformResponseData);
  http.interceptors.response.use(transformKeysResponseData);

  return http;
}
