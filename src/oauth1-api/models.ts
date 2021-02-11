export interface ApiRequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: any;
  data?: any;
  oauthConsumer?: OauthKeyPair;
  oauthToken?: OauthKeyPair;
  timeout?: number;
  rawResponse?: boolean;
  logRequests?: boolean;
}

export interface OauthKeyPair {
  key: string;
  secret: string;
}

export interface ApiClientOptions {
  host?: string;
  oauthConsumer?: OauthKeyPair;
  oauthToken?: OauthKeyPair;
  headers?: {
    [name: string]: string;
  };
  timeout?: number;
  rawResponse?: boolean;
}
