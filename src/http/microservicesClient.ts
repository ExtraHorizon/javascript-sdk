import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MicroservicesConfig } from '../types';
import { OAuthClient, ServiceDiscoveryConfig } from './types';
import {
  camelizeResponseData,
  transformKeysResponseData,
  transformResponseData,
} from './interceptors';
import { typeReceivedError } from '../errorHandler';

export function createMicroservicesHttpClient(
  http: AxiosInstance,
  options: MicroservicesConfig
): OAuthClient {
  let authConfig: ServiceDiscoveryConfig;
  const httpWithAuth = axios.create({ ...http.defaults });

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

  httpWithAuth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      // Only needed if it's an axiosError, otherwise it's already typed
      if (error && error.isAxiosError) {
        return Promise.reject(typeReceivedError(error));
      }
      return Promise.reject(error);
    }
  );

  httpWithAuth.interceptors.request.use(
    async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
      const [_, service, version] = config.url.split('/');
      const { host, port } = await options.serviceUrlFn({ service, version });
      return {
        ...config,
        headers: { ...config.headers, 'X-secret': authConfig.secret },
        baseURL: `${host}:${port}`,
      };
    }
  );

  httpWithAuth.interceptors.response.use(camelizeResponseData);
  httpWithAuth.interceptors.response.use(transformResponseData);
  httpWithAuth.interceptors.response.use(transformKeysResponseData);

  async function authenticate(data: ServiceDiscoveryConfig): Promise<void> {
    authConfig = data;
  }

  return {
    ...httpWithAuth,
    authenticate,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async confirmMfa() {},
    logout() {
      return false;
    },
    get userId() {
      return '';
    },
  };
}
