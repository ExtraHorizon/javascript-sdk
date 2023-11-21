import axios from 'axios';
import { HttpClientConfig, HttpInstance } from '../types';
import {
  camelizeResponseData,
  typeReceivedErrorsInterceptor,
} from './interceptors';
import { composeUserAgent } from './utils';

export function createHttpClient({
  packageVersion,
  host,
  requestLogger,
  responseLogger,
  headers = {},
  skipCaseNormalizationForCustomProperties,
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

  http.interceptors.response.use(
    camelizeResponseData,
    typeReceivedErrorsInterceptor
  );

  // @ts-expect-error: typescript can't handle the de-structuring well here.
  return { ...http, skipCaseNormalizationForCustomProperties };
}
