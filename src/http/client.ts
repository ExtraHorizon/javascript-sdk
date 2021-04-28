import axios, { AxiosInstance } from 'axios';
import { UserNotAuthenticatedError } from '../errors';
import { ErrorClassDefinitionsMap } from '../errorHandler';
import { Config } from '../types';
import { camelizeResponseData } from './interceptors';

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

  http.interceptors.response.use(camelizeResponseData, async error => {
    // This is needed for catching cases where authenticated endpoints are called
    // before authenticate is called. Then the default axios instance is used
    if (
      ErrorClassDefinitionsMap[error.response.data.code] ===
      UserNotAuthenticatedError
    ) {
      return Promise.reject(
        new Error(
          `

Looks like you forgot to authenticate. Please check the README file to get started.  
As example if you want to use the Oauth2 Password Grant Flow you can authenticate using this snippet:

const sdk = client({
  apiHost: '${apiHost}',
});
await sdk.auth.authenticate({
  clientId: '',
  username: '',
  password: '',
});  

`
        )
      );
    }
    return Promise.reject(error);
  });

  return http;
}
