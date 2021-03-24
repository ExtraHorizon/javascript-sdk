export interface ConfigOauth1 {
  consumerKey: string;
  consumerSecret: string;
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
  oauth?: ConfigOauth1 | ConfigOath2;
}
