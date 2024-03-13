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
  /**
   * @deprecated this property is only meant to be used for backwards compatibility when upgrading to v8.0.0.
   *
   * Key names that are not chosen by Extra Horizon where also affected by the data normalization before v8.0.0.
   * They were converted from camel case to snake case before sending the request and the other way around before
   * providing the response.
   *
   * Also fields ending with the name timestamp not chosen by extra horizon in custom properties where automatically
   * converted to dates. Even though they could be just booleans, strings or numbers. Dates provided in such fields will
   * now be converted to strings while all other types will stay as they are.
   *
   * 'records_affected', 'recordsAffected' as keys in custom properties were converted to affectedRecords. In v8.0.0
   * they also stay as they are.
   *
   * To enable this behaviour again, set to true.
   */
  normalizeCustomData?: boolean;
}

export interface ParamsOauth1Consumer extends ParamsBase {
  consumerKey: string;
  consumerSecret: string;
}

export interface ParamsOauth1Token extends ParamsOauth1Consumer {
  token: string;
  tokenSecret: string;
}

export type ParamsOauth1 = ParamsOauth1Consumer | ParamsOauth1Token;

export interface ParamsOauth2Client extends ParamsBase {
  clientId: string;
  clientSecret?: string;
  freshTokensCallback?: (tokenData: TokenDataOauth2) => void;
}

export interface ParamsOauth2AccessToken extends ParamsOauth2Client {
  refreshToken: string;
  accessToken: string;

  /**
   * Can be supplied just as it is returned by the different authentication methods and the `freshTokensCallback`.
   * Allows the SDK to continue using the supplied access token until just before it expires, then it is automatically refreshed.
   */
  expiresIn?: number;

  /**
   * Can be supplied just as it is returned by the different authentication methods and the `freshTokensCallback`.
   * Allows the SDK to continue using the supplied access token until just before it expires, then it is automatically refreshed.
   */
  creationTimestamp?: Date | string;
}

export type ParamsOauth2 = ParamsOauth2Client | ParamsOauth2AccessToken;

export type ParamsProxy = ParamsBase;

interface HttpClientBase {
  packageVersion: string;
}

export type ClientParams = ParamsOauth1 | ParamsOauth2 | ParamsProxy;
export type HttpClientConfig = HttpClientBase & ClientParams;
