/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AxiosDefaults,
  AxiosError,
  AxiosInterceptorManager,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type HttpResponse<T = any> = AxiosResponse<T> & {
  config: HttpRequestConfig;
};

export type HttpRequestConfig = AxiosRequestConfig & {
  interceptors?: {
    skipCamelizeResponseData?: boolean;
    skipTransformResponseData?: boolean;
    skipTransformKeysResponseData?: boolean;
  };
  retry?: {
    tries: number;
    retryTimeInMs: number;
    current: number;
    retryCondition: (error: HttpResponseError) => boolean;
  };
};

export type HttpResponseError = AxiosError & { config: HttpRequestConfig };

export interface HttpInstance {
  (config: AxiosRequestConfig): AxiosPromise;
  (url: string, config?: AxiosRequestConfig): AxiosPromise;
  defaults: AxiosDefaults;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: HttpRequestConfig): string;
  request<T = any, R = AxiosResponse<T>>(config: HttpRequestConfig): Promise<R>;
  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<R>;
  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<R>;
  head<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<R>;
  options<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<R>;
  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<R>;
  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
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

export interface OAuth2HttpClient extends HttpInstance {
  extraAuthMethods: {
    /**
     * Use OAuth2 Authorization Code Grant flow with callback
     * @example
     * await sdk.auth.authenticate({
     *  code: '',
     * });
     * @throws {InvalidRequestError}
     * @throws {InvalidGrantError}
     * @throws {UnsupportedGrantTypeError}
     * @throws {MfaRequiredError}
     * @throws {InvalidClientError}
     */
    authenticate(oauth: { code: string }): Promise<TokenDataOauth2>;

    /**
     * Use OAuth2 Password Grant flow
     * @example
     * await sdk.auth.authenticate({
     *  password: '',
     *  username: '',
     * });
     * @throws {InvalidRequestError}
     * @throws {InvalidGrantError}
     * @throws {UnsupportedGrantTypeError}
     * @throws {MfaRequiredError}
     * @throws {InvalidClientError}
     */
    authenticate(oauth: {
      username: string;
      password: string;
    }): Promise<TokenDataOauth2>;

    /**
     * Use OAuth2 Refresh Token Grant flow
     * @example
     * await sdk.auth.authenticate({
     *  refreshToken: '',
     * });
     * @throws {InvalidRequestError}
     * @throws {InvalidGrantError}
     * @throws {UnsupportedGrantTypeError}
     * @throws {MfaRequiredError}
     * @throws {InvalidClientError}
     */
    authenticate(oauth: { refreshToken: string }): Promise<TokenDataOauth2>;

    /**
     *  Confirm MFA method with token, methodId and code
     *  @example
     *  try {
     *    await sdk.auth.authenticate({
     *      username: '',
     *      password: '',
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
    confirmMfa: (data: MfaConfig) => Promise<TokenDataOauth2>;

    /**
     *  Logout
     *  @returns {boolean} Success
     *  @example
     *  try {
     *    await sdk.auth.authenticate({
     *      username: '',
     *      password: '',
     *    });
     *    sdk.auth.logout();
     *  } catch (error) {
     *    console.log(error)
     *  }
     */
    logout: () => boolean;
  };

  userId: Promise<string | undefined>;
}

export interface OAuth1HttpClient extends HttpInstance {
  extraAuthMethods: {
    /**
     * Use OAuth1 Token authentication
     * @example
     * await sdk.auth.authenticate({
     *  token: '',
     *  tokenSecret: '',
     * });
     * @throws {ApplicationNotAuthenticatedError}
     * @throws {AuthenticationError}
     * @throws {LoginTimeoutError}
     * @throws {LoginFreezeError}
     * @throws {TooManyFailedAttemptsError}
     * @throws {MfaRequiredError}
     */
    authenticate(oauth: {
      token: string;
      tokenSecret: string;
      skipTokenCheck?: boolean;
    }): Promise<TokenDataOauth1>;

    /**
     * Use OAuth1 Password authentication
     * @example
     * await sdk.auth.authenticate({
     *  email: '',
     *  password: '',
     * });
     * @throws {ApplicationNotAuthenticatedError}
     * @throws {AuthenticationError}
     * @throws {LoginTimeoutError}
     * @throws {LoginFreezeError}
     * @throws {TooManyFailedAttemptsError}
     * @throws {MfaRequiredError}
     */
    authenticate(oauth: {
      email: string;
      password: string;
    }): Promise<TokenDataOauth1>;

    /**
     *  Confirm MFA method with token, methodId and code
     *  @example
     *  try {
     *    await sdk.auth.authenticate({
     *      email: '',
     *      password: '',
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
    confirmMfa: (data: MfaConfig) => Promise<TokenDataOauth1>;

    /**
     *  Logout
     *  @returns {boolean} Success
     *  @example
     *  try {
     *    await sdk.auth.authenticate({
     *      email: '',
     *      password: '',
     *    });
     *    sdk.auth.logout();
     *  } catch (error) {
     *    console.log(error)
     *  }
     */
    logout: () => boolean;
  };

  userId: Promise<string | undefined>;
}

export interface ProxyInstance extends HttpInstance {
  extraAuthMethods: {
    /**
     *  Logout
     *  @returns {boolean} Success
     */
    logout: () => Promise<boolean>;
  };
  userId: Promise<string | undefined>;
}

export type AuthHttpClient =
  | OAuth1HttpClient
  | OAuth2HttpClient
  | ProxyInstance;

export interface MfaConfig {
  token: string;
  methodId: string;
  code: string;
}
