import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as OAuth from 'oauth-1.0a';
import { TokenDataOauth1, TokenDataOauth2 } from './http/types';

export * from './http/types';
export * from './services/types';
export * from './services/auth/types';
export * from './services/data/types';
export * from './services/files/types';
export * from './services/tasks/types';
export * from './services/users/types';
export * from './services/dispatchers/types';

export type HttpInstance = AxiosInstance;
export type HttpRequestConfig = AxiosRequestConfig;

export interface ParamsOauth1WithEmail {
  email: string;
  password: string;
}

export interface ParamsOauth1WithToken {
  token: string;
  tokenSecret: string;
}

export interface ParamsOauth2AuthorizationCode {
  code: string;
  redirectUri: string;
}

export interface ParamsOauth2Password {
  username: string;
  password: string;
}

export interface ParamsOauth2Refresh {
  refreshToken: string;
}

export type AuthParams =
  | ParamsOauth1WithEmail
  | ParamsOauth1WithToken
  | ParamsOauth2AuthorizationCode
  | ParamsOauth2Password
  | ParamsOauth2Refresh;

interface ParamsBase {
  apiHost: string;
  responseLogger?: (response: AxiosResponse | Error) => unknown;
  requestLogger?: (request: AxiosRequestConfig | Error) => unknown;
  freshTokensCallback?: (tokenData: TokenDataOauth2 | TokenDataOauth1) => void;
}

export interface ParamsOauth1 extends ParamsBase {
  consumerKey: string;
  consumerSecret: string;
}

export interface ParamsOauth2 extends ParamsBase {
  clientId: string;
}

export interface ConfigOauth1 extends ParamsBase {
  path: string;
  oauth1: OAuth;
}

export interface ConfigOauth2 extends ParamsBase {
  path: string;
  params: {
    // eslint-disable-next-line camelcase
    client_id: string;
  };
}

export type ClientParams = ParamsOauth1 | ParamsOauth2;
export type ClientConfig = ConfigOauth1 | ConfigOauth2;
