/* eslint-disable no-underscore-dangle */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from './types';

const errorLogger = error => {
  console.log('error', error);
  // TODO
};

export const createHttpClient = ({ apiHost }: Pick<Config, 'apiHost'>) => {
  const instance = axios.create({
    baseURL: `https://api.${apiHost}`,
  });
  // instance.interceptors.request.use(config => {
  //   console.log('config', config);
  //   return config;
  // });
  instance.interceptors.response.use(res => res, errorLogger);
  return instance;
};

const parseAuthParams = options => {
  if ('consumerKey' in options) {
    // oauth v1
    return {};
  }

  if ('username' in options) {
    // oauth v2
    return {
      path: '/auth/v2/oauth2/token',
      params: {
        grant_type: 'password',
        client_id: options.clientId,
        username: options.username,
        password: options.password,
      },
    };
  }

  if ('code' in options) {
    // oauth v2
    return {
      path: '/auth/v2/oauth2/token',
      params: {
        grant_type: 'authorization_code',
        client_id: options.clientId,
      },
    };
  }
  return {};
};
export const addAuth = (http: AxiosInstance, options: Config['oauth']) => {
  let accessToken = '';
  let refreshToken = '';
  const httpWithAuth = axios.create({ ...http.defaults });
  const auth = parseAuthParams(options);

  const refreshTokens = async () => {
    const tokenResult = await http.post(auth.path, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    accessToken = tokenResult.data.access_token;
    refreshToken = tokenResult.data.refresh_token;
    return accessToken;
  };

  const authenticate = async () => {
    // console.log('authenticate', authParams);
    const tokenResult = await http.post(auth.path, auth.params);
    // console.log('tokenResult', tokenResult);
    accessToken = tokenResult.data.access_token;
    refreshToken = tokenResult.data.refresh_token;
    return accessToken;
  };

  httpWithAuth.interceptors.request.use(async config => ({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${accessToken || (await authenticate())}`,
    },
  }));

  httpWithAuth.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      const originalRequest = error.config;
      if (
        error.response &&
        (error.response.status === 403 || error.response.status === 401) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        accessToken = '';
        if (error.response.code === 118) {
          // ACCESS_TOKEN_EXPIRED_EXCEPTION
          originalRequest.headers.Authorization = `Bearer ${await refreshTokens()}`;
        } else {
          // All others, retry authenticate
          originalRequest.headers.Authorization = `Bearer ${await authenticate()}`;
        }
        return http(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  return httpWithAuth;
};
