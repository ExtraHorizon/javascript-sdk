import { AxiosResponse } from 'axios';
import { TokenDataOauth2, HttpRequestConfig } from './http/types';

export * from './http/types';
export * from './services/types';
export * from './services/auth/types';
export * from './services/data/types';
export * from './services/files/types';
export * from './services/tasks/types';
export * from './services/users/types';
export * from './services/mails/types';
export * from './services/templates/types';
export * from './services/configurations/types';
export * from './services/dispatchers/types';
export * from './services/payments/types';
export * from './services/localizations/types';
export * from './services/profiles/types';
export * from './services/notifications/types';
export * from './services/events/types';

export interface ParamsOauth1WithEmail {
  email: string;
  password: string;
}

export interface ParamsOauth1WithToken {
  token: string;
  tokenSecret: string;
  skipTokenCheck?: boolean;
}

export interface ParamsOauth2AuthorizationCode {
  code: string;
}

export interface ParamsOauth2Password {
  username: string;
  password: string;
}

export interface ParamsOauth2Refresh {
  refreshToken: string;
}

export type Oauth1AuthParams = ParamsOauth1WithEmail | ParamsOauth1WithToken;

export type Oauth2AuthParams =
  | ParamsOauth2AuthorizationCode
  | ParamsOauth2Password
  | ParamsOauth2Refresh;

export type AuthParams = Oauth1AuthParams | Oauth2AuthParams;

interface ParamsBase {
  host: string;
  responseLogger?: (response: AxiosResponse | Error) => unknown;
  requestLogger?: (request: HttpRequestConfig | Error) => unknown;
  headers?: {
    'X-Request-Service'?: string;
    'X-Forwarded-Application'?: string;
    'X-Forwarded-User'?: string;
  };
}

export interface ParamsOauth1 extends ParamsBase {
  consumerKey: string;
  consumerSecret: string;
}

export interface ParamsOauth2 extends ParamsBase {
  clientId: string;
  clientSecret?: string;
  freshTokensCallback?: (tokenData: TokenDataOauth2) => void;
}

export type ParamsProxy = ParamsBase;

interface HttpClientBase {
  packageVersion: string;
}

export type ClientParams = ParamsOauth1 | ParamsOauth2 | ParamsProxy;
export type HttpClientConfig = HttpClientBase & ClientParams;
