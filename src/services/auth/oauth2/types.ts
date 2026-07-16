import {
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../../types';
import { AuthOauth2TokenService } from './accessTokens/types';
import { OAuth2AuthorizationsService } from './authorizations/types';
import { OAuth2RefreshTokenService } from './refreshTokens/types';

export * from './accessTokens/types';
export * from './authorizations/types';
export * from './refreshTokens/types';

export interface AuthOauth2Service {
  tokens: AuthOauth2TokenService;
  refreshTokens: OAuth2RefreshTokenService;
  authorizations: OAuth2AuthorizationsService;

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
   * @deprecated - Will be removed in a future version, please use `auth.oauth2.authorizations.create` instead
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
   * none | | Can only see a list of OAuth2 authorizations for this account
   * VIEW_AUTHORIZATIONS | global | See any authorizations belonging to any user
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/get_oauth2_authorizations
   * @deprecated - Will be removed in a future version, please use `auth.oauth2.authorizations.find*` instead
   */
  getAuthorizations(
    options?: OptionsWithRql
  ): Promise<PagedResult<OAuth2Authorization>>;

  /**
   * Delete an OAuth2 Authorization
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only delete OAuth2 authorizations for this account
   * DELETE_AUTHORIZATIONS | global | Delete any authorizations belonging to any user
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/delete_oauth2_authorizations__authorizationId_
   * @throws {ResourceUnknownError}
   * @deprecated - Will be removed in a future version, please use `auth.oauth2.authorizations.remove` instead
   */
  deleteAuthorization(
    authorizationId: string,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
}

export interface OAuth2AuthorizationCreation {
  responseType: 'code';
  clientId: string;
  redirectUri?: string;
  state?: string;
  codeChallengeMethod?: PKCECodeMethods;
  codeChallenge?: string;
}

export interface OAuth2AuthorizationCreationResponse {
  id: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  state?: string;
  codeChallengeMethod?: PKCECodeMethods;
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
  codeChallengeMethod?: PKCECodeMethods;
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

export enum PKCECodeMethods {
  PLAIN = 'plain',
  S256 = 'S256',
}
