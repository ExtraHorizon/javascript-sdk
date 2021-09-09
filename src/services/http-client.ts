import pako from 'pako';
import platform from 'platform-specific';
import {
  HttpInstance,
  HttpRequestConfig,
  HttpResponseError,
} from '../http/types';

interface HttpClientOptions {
  basePath: string;
  transformRequestData?(args: Record<string, unknown>): Record<string, unknown>;
}

interface Options {
  gzip?: boolean;
}

interface GetOptions {
  shouldRetry?: boolean;
}

const defaultRetryConfig = {
  tries: 5,
  retryTimeInMs: 300,
  current: 1,
  retryCondition: (error: HttpResponseError) => {
    try {
      if (error.response?.status >= 500 && error.response?.status <= 599) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};

const httpClient = ({
  basePath,
  transformRequestData = data => data,
}: HttpClientOptions) => ({
  get: (
    axios: HttpInstance,
    url: string,
    { shouldRetry, ...config }: HttpRequestConfig & GetOptions = {}
  ) =>
    axios.get(`${basePath}${url}`, {
      ...config,
      ...(shouldRetry !== false ? { retry: defaultRetryConfig } : {}),
    }),
  put: (axios: HttpInstance, url: string, data, config?: HttpRequestConfig) =>
    axios.put(`${basePath}${url}`, transformRequestData(data), config),
  post: (
    axios: HttpInstance,
    url: string,
    data,
    config?: HttpRequestConfig,
    options?: Options
  ) =>
    axios.post(`${basePath}${url}`, transformRequestData(data), {
      ...config,
      ...(options?.gzip
        ? {
            transformRequest: [
              // eslint-disable-next-line no-nested-ternary
              ...(axios.defaults.transformRequest
                ? Array.isArray(axios.defaults.transformRequest)
                  ? axios.defaults.transformRequest
                  : [axios.defaults.transformRequest]
                : []),
              (dataInTransform, headers) => {
                if (typeof dataInTransform === 'string') {
                  // eslint-disable-next-line no-param-reassign
                  headers['Content-Encoding'] = 'gzip';

                  // React Native on Android gzips the data implicitly. DO NOT TOUCH!
                  if (platform.platform === 'android') {
                    return dataInTransform;
                  }

                  // Nodejs uses the http adapter in Axios. Needs a Buffer with the gzip data
                  if (platform.platform === 'nodejs') {
                    return Buffer.from(pako.gzip(dataInTransform));
                  }

                  // In Browser and React Native on Ios, pako is used.
                  return pako.gzip(dataInTransform);
                }
                return dataInTransform;
              },
            ],
          }
        : {}),
    }),
  delete: (axios: HttpInstance, url: string, config?: HttpRequestConfig) =>
    axios.delete(`${basePath}${url}`, config),
});

export default httpClient;

export type HttpClient = ReturnType<typeof httpClient>;
