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
