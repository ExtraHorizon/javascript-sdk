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

interface OauthConfigBase {
  path: string;
}

export interface Oauth1Config extends OauthConfigBase {
  params: {
    email: string;
    password: string;
  };
  oauth1: OAuth;
}

interface Oauth2ConfigPassword extends OauthConfigBase {
  params: {
    grant_type: string;
    client_id: string;
    username: string;
    password: string;
  };
}

interface Oauth2ConfigCode extends OauthConfigBase {
  params: {
    grant_type: string;
    client_id: string;
  };
}

interface Oauth2Mfa extends OauthConfigBase {
  params: {
    grant_type: string;
    client_id: string;
    username: string;
    password: string;
  };
  mfa: {
    grant_type: string;
    client_id: string;
    code: string;
  };
}

export type AuthConfig =
  | Oauth2ConfigPassword
  | Oauth2ConfigCode
  | Oauth2Mfa
  | Oauth1Config;
