import {
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../../types';

export interface AuthOauth2Service {
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
