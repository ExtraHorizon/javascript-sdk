import axios, { AxiosInstance } from 'axios';
import { typeReceivedError } from '../errorHandler';
import { ClientConfig } from '../types';
import { camelizeResponseData } from './interceptors';

export function createHttpClient({
  host,
  requestLogger,
  responseLogger,
}: ClientConfig): AxiosInstance {
  const http = axios.create({
    baseURL: host,
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
