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
  ): Promise<OAuth2Authorization>;

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
   * Get the first OAuth2 token found
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 tokens for any account
   */
  findFirst(options?: OptionsWithRql): Promise<OAuth2Token>;

  /**
   * Get an oAuth2 token by its id
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth2 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 tokens for any account
   */
  findById(id: string, options?: OptionsWithRql): Promise<OAuth2Token>;

  /**
   * Remove an oAuth2 token
   *
   * Permission | Scope | Effect
   * - | - | -
   * DELETE_AUTHORIZATIONS | | Required for this endpoint
   */
  remove(id: string): Promise<AffectedRecords>;
}

export interface OAuth2AuthorizationCreation {
  responseType: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
}

export interface OAuth2Authorization {
  id: string;
  userId: string;
  clientId: string;
  authorizationCode: string;
  state: string;
  /** The timestamp when the authorization was last updated */
  updateTimestamp?: Date;
  /** The timestamp when the authorization was created */
  creationTimestamp?: Date;
}

export interface OAuth2Token {
  id: string;
  applicationId: string;
  userId: string;
  refreshTokenId: string;
  accessToken: string;
  expiryTimestamp: Date;
  updateTimestamp: Date;
  creationTimestamp: Date;
}
