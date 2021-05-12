/* eslint-disable camelcase */

import { AxiosInstance } from 'axios';

export interface TokenDataOauth2 {
  accessToken: string;
  refreshToken: string;
}

export interface TokenDataOauth1 {
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

export interface OAuthClient extends AxiosInstance {
  authenticate: (data: AuthConfig) => Promise<void>;
  confirmMfa: (data: MfaConfig) => Promise<void>;
}

export interface MfaConfig {
  token: string;
  methodId: string;
  code: string;
}
