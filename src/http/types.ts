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
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  applicationId: string;
  userId: string;
}

export interface TokenDataOauth1 {
  id?: string;
  key: string;
  secret: string;
  token?: string;
  tokenSecret?: string;
  applicationId?: string;
  userId?: string;
  updateTimeStamp?: string;
  creationTimestamp?: string;
}

export interface OidcAuthenticationUrlRequest {
  /** The state parameter to be included in the authentication URL */
  state?: string;
}

export interface OidcAuthenticationUrl {
  /** The authentication URL the user should be directed to */
  authenticationUrl: string;
}

export interface OidcAuthenticateRequest {
  /** The authorizationCode received from the provider via the redirect after the user authenticated with the provider */
  authorizationCode: string;
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
    confirmMfa(data: MfaConfig): Promise<TokenDataOauth2>;

    /**
     * ## Generate an OIDC authentication URL
     * You can use this endpoint to generate a fully configured OIDC authentication URL.
     * You can use the authentication URL to redirect the user to the specified OIDC provider to initiate the authentication process.
     *
     * Once the user is authenticated, the OIDC provider will redirect the user to the configured `redirectUri` with an authorization code.
     * The authorization code can then be used to login (see `auth.authenticateWithOidc()`).
     *
     * A state parameter can be added to the URL.
     * Supply the `state` property to this function and the state parameter will be included in the URL.
     * If supplied, the provider will add the same state parameter and value again to the URL when redirecting the user is back to your application (the configured `redirectUri`).
     * This can (and should) be used to protect against Cross-Site Request Forgery (CSRF) attacks.
     *
     * A `nonce` parameter is automatically added and will be validated during the authorization code exchange by ExH.
     *
     * #### Example URL
     * An example of a fully configured authentication URL: (new lines added for readability)
     * ```txt
     * https://accounts.google.com/o/oauth2/auth
     *   ?response_type=code
     *   &client_id=123456789-abcdefghijklw.apps.googleusercontent.com
     *   &scope=openid%20email%20profile
     *   &redirect_uri=https%3A%2F%2Fapi.dev.yourapp.com%2Fcallback
     *   &nonce=608c038a830f40d7fe028a3f05c85b84f9040d37
     * ```
     *
     * #### Function details
     * @param providerName The name of the OIDC provider to generate an authentication URL for
     * @param data {@link OidcAuthenticationUrlRequest}
     *
     * @returns An object containing the authentication URL
     *
     * @throws {@link IllegalStateError} When targeting a disabled provider. A provider must be enabled to allow users to use this endpoint.
     */
    generateOidcAuthenticationUrl(
      providerName: string,
      data?: OidcAuthenticationUrlRequest
    ): Promise<OidcAuthenticationUrl>;

    /**
     * ## Authenticate a user with OIDC
     * You can use this method to authenticate a user after obtaining a authorization code from an OIDC provider.
     * The authorization code is obtained when an OIDC provider redirects a user back to your application after a successful authentication.
     * The authorization code may be URL encoded, so make sure your application decodes it before providing it here.
     * See `auth.generateOidcAuthenticationUrl()` to initiate the authentication process.
     *
     * Like the `auth.authenticate()` method, the SDK uses the returned access token and refresh token to authenticate successive requests.
     *
     * All (successful and failed) login attempts are logged. See `auth.oidc.getLoginAttempts()`.
     *
     * #### Function details
     * @param providerName The name of the OIDC provider to login with
     * @param data {@link OidcAuthenticateRequest}
     *
     * @returns The OAuth2 tokens generated for the user.
     *
     * @throws {@link IllegalStateError} When targeting a disabled provider. A provider must be enabled to allow users to use this endpoint.
     * @throws {@link OAuth2MissingClientCredentialsError} When no client credentials are specified or, for a confidential application, the `clientSecret` is missing.
     * @throws {@link OidcProviderResponseError} When the provider is incorrectly configured or the provider gave us an unexpected response. Please check the provider configuration.
     * @throws {@link OidcInvalidAuthorizationCodeError} When the provided `authorizationCode` is not accepted or recognized by the provider.
     * @throws {@link EmailUsedError} When a new ExH account is being created for the user trying to login with an email address which is already in use by an existing ExH account.
     * @throws {@link OAuth2ClientIdError} When the supplied `clientId` could not be found.
     * @throws {@link OAuth2ClientSecretError} When the supplied `clientSecret` is incorrect.
     * @throws {@link OidcIdTokenError} When we understood the response of the provider but the id token returned is invalid.
     */
    authenticateWithOidc(
      providerName: string,
      data: OidcAuthenticateRequest
    ): Promise<TokenDataOauth2>;

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
    logout(): boolean;
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
    confirmMfa(data: MfaConfig): Promise<TokenDataOauth1>;

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
    logout(): boolean;
  };

  userId: Promise<string | undefined>;
}

export interface ProxyInstance extends HttpInstance {
  extraAuthMethods: {
    /**
     *  Logout
     *  @returns {boolean} Success
     */
    logout(): Promise<boolean>;
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
