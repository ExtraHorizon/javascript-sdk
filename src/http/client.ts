/* eslint-disable no-underscore-dangle */
import * as AxiosLogger from 'axios-logger';

import axios from 'axios';
import { Config } from '../types';
import { camelizeResponseData, errorLogger } from './utils';

export function createHttpClient({ apiHost, debug }: Config) {
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
  http.interceptors.response.use(res => res, errorLogger);
  http.interceptors.response.use(camelizeResponseData);

  return http;
}

export default createHttpClient;
