import pako from 'pako';
import { HttpInstance, HttpRequestConfig } from '../types';

interface HttpClient {
  basePath: string;
  transformRequestData?(
    args?: Record<string, unknown>
  ): Record<string, unknown>;
}

interface Options {
  gzip?: boolean;
}

export default ({
  basePath,
  transformRequestData = data => data,
}: HttpClient) => ({
  get: (axios: HttpInstance, url: string, config?: HttpRequestConfig) =>
    axios.get(`${basePath}${url}`, config),
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
              ...(Array.isArray(axios.defaults.transformRequest)
                ? axios.defaults.transformRequest
                : [axios.defaults.transformRequest]),

              (dataInTransform, headers) => {
                if (
                  typeof dataInTransform === 'string' &&
                  dataInTransform.length > 1024
                ) {
                  // eslint-disable-next-line no-param-reassign
                  headers['Content-Encoding'] = 'gzip';
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
