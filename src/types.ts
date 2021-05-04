import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenDataOauth1, TokenDataOauth2 } from './http/types';

export type HttpInstance = AxiosInstance;
export type HttpRequestConfig = AxiosRequestConfig;

interface ParamsOauth1Base {
  consumerKey: string;
  consumerSecret: string;
}

export interface ParamsOauth1WithEmail extends ParamsOauth1Base {
  email: string;
  password: string;
}

export interface ParamsOauth1WithToken extends ParamsOauth1Base {
  token: string;
  tokenSecret: string;
}

export interface ParamsOauth2AuthorizationCode {
  clientId: string;
  code: string;
  redirectUri: string;
}

export interface ParamsOauth2Password {
  clientId: string;
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

export interface Config {
  apiHost: string;
  responseLogger?: (response: AxiosResponse | Error) => unknown;
  requestLogger?: (request: AxiosRequestConfig | Error) => unknown;
  freshTokensCallback?: (tokenData: TokenDataOauth2 | TokenDataOauth1) => void;
}

export interface MfaConfig {
  token: string;
  methodId: string;
  code: string;
}
