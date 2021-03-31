import { AxiosInstance } from 'axios';

export type HttpInstance = AxiosInstance;

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

export type ConfigOath2 = ConfigOauth2AuthorizationCode | ConfigOauth2Password;

export interface Config {
  apiHost: string;
  debug?: boolean;
  oauth?: ConfigOauth1WithEmail | ConfigOauth1WithToken | ConfigOath2;
}
