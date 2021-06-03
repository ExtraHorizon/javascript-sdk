import axios, { AxiosInstance } from 'axios';
import { typeReceivedError } from '../errorHandler';
import { HttpClientConfig } from '../types';
import { camelizeResponseData } from './interceptors';
import { composeUserAgent } from './utils';

export function createHttpClient({
  packageVersion,
  host,
  requestLogger,
  responseLogger,
}: HttpClientConfig): AxiosInstance {
  const http = axios.create({
    baseURL: host,
    headers: {
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

  http.interceptors.response.use(camelizeResponseData, async error =>
    Promise.reject(typeReceivedError(error))
  );

  return http;
}
