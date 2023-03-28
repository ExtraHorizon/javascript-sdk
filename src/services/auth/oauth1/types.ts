import { AffectedRecords, OptionsWithRql, PagedResult } from '../../types';

export interface AuthOauth1Service {
  /**
   * Generate an SSO token with OAuth 1 authentication
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/SSO/post_oauth1_ssoTokens_generate
   * @throws {ApplicationNotAuthenticatedError}
   * @throws {UserNotAuthenticatedError}
   */
  generateSsoToken(): Promise<SsoToken>;
  /**
   * Consume an SSO token to get OAuth 1 tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/SSO/post_oauth1_ssoTokens_generate
   * @throws {ApplicationNotAuthenticatedError}
   * @throws {ResourceUnknownError}
   */
  consumeSsoToken(ssoToken: string): Promise<OAuth1Token>;
  /**
   * Get a list of OAuth1 tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth1 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth1 tokens for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/OAuth1/get_oauth1_tokens
   */
  getTokens(options?: OptionsWithRql): Promise<PagedResult<OAuth1Token>>;
  /**
   * Delete a token
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth1 tokens for this account
   * VIEW_AUTHORIZATIONS | | Can remove any OAuth1 tokens of any account
   * * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/OAuth1/post_oauth1_tokens_mfa
   */
  removeToken(tokenId: string): Promise<AffectedRecords>;
}

export interface SsoToken {
  id: string;
  ssoToken: string;
  userId: string;
  createdByApplicationId: string;
  expiryTimestamp: Date;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface OAuth1Token {
  id: string;
  userId: string;
  applicationId: string;
  token: string;
  tokenSecret: string;
  lastUsedTimestamp: Date;
  creationTimestamp: Date;
}
