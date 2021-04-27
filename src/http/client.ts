import axios, { AxiosInstance } from 'axios';
import { Config } from '../types';
import { camelizeResponseData } from './utils';

export function createHttpClient({
  apiHost,
  requestLogger,
  responseLogger,
}: Config): AxiosInstance {
  const http = axios.create({
    baseURL: apiHost,
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
        return error;
      }
    );
  }

  http.interceptors.response.use(camelizeResponseData);

  return http;
}
