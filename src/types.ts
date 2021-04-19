import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TokenDataOauth2 } from './http/types';

export type HttpInstance = AxiosInstance;
export type HttpRequestConfig = AxiosRequestConfig;

interface ConfigOauth1Base {
  consumerKey: string;
  consumerSecret: string;
}

export interface ConfigOauth1WithEmail extends ConfigOauth1Base {
  email: string;
  password: string;
}

export interface ConfigOauth1WithToken extends ConfigOauth1Base {
  tokenKey: string;
  tokenSecret: string;
}

export interface ConfigOauth2AuthorizationCode {
  clientId: string;
  code: string;
  redirectUri: string;
}

export interface ConfigOauth2Password {
  clientId: string;
  username: string;
  password: string;
}

export interface ConfigOauth2Refresh {
  accessToken: string;
  refreshToken: string;
}

export type OAuthConfig =
  | ConfigOauth1WithEmail
  | ConfigOauth1WithToken
  | ConfigOauth2AuthorizationCode
  | ConfigOauth2Password
  | ConfigOauth2Refresh;

export interface Config {
  apiHost: string;
  debug?: boolean;
  freshTokensCallback?: (tokenData: TokenDataOauth2) => void;
}

export interface MfaConfig {
  token: string;
  methodId: string;
  code: string;
}
