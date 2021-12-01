/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  AxiosError,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type HttpRequestConfig = AxiosRequestConfig & {
  retry?: {
    tries: number;
    retryTimeInMs: number;
    current: number;
    retryCondition: (error: HttpResponseError) => boolean;
  };
};

export type HttpResponseError = AxiosError & { config: HttpRequestConfig };

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
  userId: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  applicationId: string;
}

export interface TokenDataOauth1 {
  userId?: string;
  key: string;
  secret: string;
  applicationId?: string;
  token?: string;
  tokenSecret?: string;
  updateTimeStamp?: string;
  creationTimestamp?: string;
  id?: string;
}

export interface Oauth1Token {
  tokenData: {
    key: TokenDataOauth1['key'];
    secret: TokenDataOauth1['secret'];
  };
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
    code: string;
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
  authenticate: (
    data: AuthConfig
  ) => Promise<TokenDataOauth1 | TokenDataOauth2>;
  /**
   *  Confirm MFA method with token, methodId and code
   *  @example
   *  try {
   *    await sdk.auth.authenticate({
   *      password: '',
   *      username: '',
   *    });
   *  } catch (error) {
   *    if (error instanceof MfaRequiredError) {
   *      const { mfa } = error.response;
   *
   *      // Your logic to request which method the user want to use in case of multiple methods
   *      const methodId = mfa.methods[0].id;
   *
   *      await sdk.auth.confirmMfa({
   *        token: mfa.token,
   *        methodId,
   *        code: '', // code from ie. Google Authenticator
   *      });
   *    }
   *  }
   */
  confirmMfa: (data: MfaConfig) => Promise<TokenDataOauth1 | TokenDataOauth2>;
  /**
   *  Logout
   *  @returns {boolean} Success
   *  @example
   *  try {
   *    await sdk.auth.authenticate({
   *      password: '',
   *      username: '',
   *    });
   *    sdk.auth.logout();
   *  } catch (error) {
   *    console.log(error)
   *  }
   */
  logout: () => boolean;
  userId: Promise<string | undefined>;
}

export interface ProxyClient extends HttpInstance {
  userId: Promise<string | undefined>;
}

export type AuthHttpClient = OAuthClient | ProxyClient;

export interface MfaConfig {
  token: string;
  methodId: string;
  code: string;
}
