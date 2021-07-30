/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type HttpRequestConfig = AxiosRequestConfig;

export interface HttpInstance {
  defaults: AxiosRequestConfig;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R>;
  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  head<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  options<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
}
export interface TokenDataOauth2 {
  userId?: string;
  accessToken: string;
  refreshToken: string;
}

export interface TokenDataOauth1 {
  userId?: string;
  key: string;
  secret: string;
}

export interface TokenResponseOauth1 {
  id: string;
  userId: string;
  applicationId: string;
  token: string;
  tokenSecret: string;
  lastUsedTimestamp: string;
  creationTimestamp: string;
}

export interface TokenResponseOauth2 {
  grantType: string;
  username: string;
  password: string;
  clientId: string;
}

export interface Oauth1Token {
  tokenData: TokenDataOauth1;
  skipTokenCheck: boolean;
}

export interface Oauth1Password {
  params: {
    email: string;
    password: string;
  };
}

interface Oauth2ConfigPassword {
  params: {
    grant_type: string;
    username: string;
    password: string;
  };
}

interface Oauth2ConfigCode {
  params: {
    grant_type: string;
  };
}

interface Oauth2Refresh {
  params: {
    grant_type: string;
    refresh_token: string;
  };
}

export type OAuth1Config = Oauth1Token | Oauth1Password;

export type OAuth2Config =
  | Oauth2ConfigPassword
  | Oauth2ConfigCode
  | Oauth2Refresh;

export type AuthConfig = OAuth1Config | OAuth2Config;

export interface OAuthClient extends HttpInstance {
  authenticate: (data: AuthConfig) => Promise<TokenDataOauth1 | void>;
  confirmMfa: (data: MfaConfig) => Promise<void>;
  userId: string;
}

export interface MfaConfig {
  token: string;
  methodId: string;
  code: string;
}
