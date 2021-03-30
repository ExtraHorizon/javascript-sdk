import OAuth = require('oauth-1.0a');

/* eslint-disable camelcase */
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

interface AuthConfigBase {
  path: string;
}
export interface AuthConfig1 extends AuthConfigBase {
  params: {
    email: string;
    password: string;
  };
  oauth1: OAuth;
}

interface AuthConfig2Password extends AuthConfigBase {
  params: {
    grant_type: string;
    client_id: string;
    username: string;
    password: string;
  };
}
interface AuthConfig2Code extends AuthConfigBase {
  params: {
    grant_type: string;
    client_id: string;
  };
}
export type AuthConfig = AuthConfig2Password | AuthConfig2Code | AuthConfig1;
