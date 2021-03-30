/* eslint-disable no-underscore-dangle */
import * as AxiosLogger from 'axios-logger';

import axios, { AxiosInstance } from 'axios';
import { Config } from '../types';
import { camelizeResponseData } from './utils';
import { typeReceivedError } from '../errorHandler';

export function createHttpClient({ apiHost, debug }: Config): AxiosInstance {
  const http = axios.create({
    baseURL: apiHost,
  });

  if (debug) {
    http.interceptors.request.use(
      AxiosLogger.requestLogger,
      AxiosLogger.errorLogger
    );
    http.interceptors.response.use(
      AxiosLogger.responseLogger,
      AxiosLogger.errorLogger
    );
  }
  http.interceptors.response.use(
    res => res,
    (error: AxiosError) => {
      throw typeReceivedError(error);
    }
  );
  http.interceptors.response.use(camelizeResponseData);

  return http;
}

export default createHttpClient;
