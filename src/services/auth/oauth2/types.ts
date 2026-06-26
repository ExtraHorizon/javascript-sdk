import {
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../../types';

export interface AuthOauth2Service {
  tokens: AuthOauth2TokenService;

  /**
   * Create an OAuth2 authorization
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/post_oauth2_authorizations
   * @throws {ApplicationUnknownError}
   * @throws {CallbackNotValidError}
   * @throws {UnsupportedResponseTypeError}
   */
  createAuthorization(
    data: OAuth2AuthorizationCreation,
    options?: OptionsBase
  ): Promise<OAuth2AuthorizationCreationResponse>;

  /**
   * Get a list of OAuth2 Authorizations
   *
   * Permission | Scope | Effect
   * - | - | -
   * VIEW_AUTHORIZATIONS | global | **Required** for this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/get_oauth2_authorizations
   */
  getAuthorizations(
    options?: OptionsWithRql
  ): Promise<PagedResult<OAuth2Authorization>>;

  /**
   * Delete an OAuth2 Authorization
   *
   * Permission | Scope | Effect
   * - | - | -
   * DELETE_AUTHORIZATIONS | global | **Required** for this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/delete_oauth2_authorizations__authorizationId_
   * @throws {ResourceUnknownError}
   */
  deleteAuthorization(
    authorizationId: string,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}

export interface AuthOauth2TokenService {
  /**
   * Get a list of OAuth2 tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 tokens for any account
   */
  find(options?: OptionsWithRql): Promise<PagedResult<OAuth2Token>>;

  /**
   * Get a list of OAuth2 tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 tokens for any account
   */
  findAll(options?: OptionsWithRql): Promise<OAuth2Token[]>;

  /**
   * Get the first OAuth2 token found
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 tokens for any account
   */
  findFirst(options?: OptionsWithRql): Promise<OAuth2Token | undefined>;

  /**
   * Get an oAuth2 token by its id
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 tokens for any account
   */
  findById(id: string, options?: OptionsWithRql): Promise<OAuth2Token | undefined>;

  /**
   * Remove an oAuth2 token
   *
   * Permission | Scope | Effect
   * - | - | -
   * DELETE_AUTHORIZATIONS | | Required for this endpoint
   */
  remove(id: string): Promise<AffectedRecords>;
}

export interface AuthOauth2RefreshTokenService {
  /**
   * # Get a list of OAuth2 refresh tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 refresh tokens for this account
   * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
   * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
   * @param options.rql Add filters to the requested list
   * @returns PagedResult<OAuth2RefreshToken>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<OAuth2RefreshToken>>;

  /**
   * Get a list of OAuth2 refresh tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 refresh tokens for this account
   * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
   * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
   * @param options.rql Add filters to the requested list
   * @returns OAuth2RefreshToken[]
   */
  findAll(options?: OptionsWithRql): Promise<OAuth2RefreshToken[]>;

  /**
   * Get the first OAuth2 refresh token found
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 refresh tokens for this account
   * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
   * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
   * @param options.rql Add filters to the requested list
   * @returns {Promise<OAuth2RefreshToken | undefined>
   */
  findFirst(options?: OptionsWithRql): Promise<OAuth2RefreshToken | undefined>;

  /**
   * Get an oAuth2 refresh token by its id
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 refresh tokens for this account
   * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
   * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
   * @param id the refresh token id
   * @param options.rql Add filters to the requested list
   * @returns {Promise<OAuth2RefreshToken | undefined>
   */
  findById(id: string, options?: OptionsWithRql): Promise<OAuth2RefreshToken | undefined>;

  /**
   * Delete an oAuth2 refresh token
   *
   * Permission | Scope | Effect
   * - | - | -
   * DELETE_OAUTH2_REFRESH_TOKEN or DELETE_AUTHORIZATIONS | global | Required for this endpoint
   * Using DELETE_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
   * @param id the refresh token id
   * @returns AffectedRecords
   */
  remove(id: string): Promise<AffectedRecords>;
}

export interface OAuth2AuthorizationCreation {
  responseType: string;
  clientId: string;
  redirectUri?: string;
  state?: string;
  codeChallengeMethod?: string;
  codeChallenge?: string;
}

export interface OAuth2AuthorizationCreationResponse {
  id: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  state?: string;
  codeChallengeMethod?: string;
  codeChallenge?: string;
  authorizationCode: string;
  expiryTimestamp: Date;
  updateTimestamp: Date;
  creationTimestamp: Date;
}

export interface OAuth2Authorization {
  id: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  state?: string;
  codeChallengeMethod?: string;
  /**
   @deprecated `codeChallenge` will be removed from responses returned by listing endpoints in a future version.
   */
  codeChallenge?: string;
  /**
   * @deprecated `authorizationCode` will be removed from responses returned by listing endpoints in a future version.
   */
  authorizationCode?: string;
  expiryTimestamp: Date;
  updateTimestamp: Date;
  creationTimestamp: Date;
}

export interface OAuth2Token {
  id: string;
  applicationId: string;
  userId: string;
  refreshTokenId: string;
  /**
   * @deprecated `accessToken` will be removed from responses returned by listing endpoints in a future version.
   */
  accessToken?: string;
  expiryTimestamp: Date;
  updateTimestamp: Date;
  creationTimestamp: Date;
}

export interface OAuth2RefreshToken {
  id: string;
  applicationId: string;
  userId: string;
  expiryTimestamp: Date;
  updateTimestamp: Date;
  creationTimestamp: Date;
}
