import { AffectedRecords, OptionsWithRql, PagedResult } from '../../types';

export interface AuthOauth1Service {
  tokens: AuthOauth1TokenService;

  /**
   * Generate an SSO token with OAuth 1 authentication
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
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
   * @throws {ApplicationNotAuthenticatedError}
   * @throws {ResourceUnknownError}
   */
  consumeSsoToken(ssoToken: string): Promise<OAuth1Token>;

  /**
   * @deprecated Use `exh.auth.oauth1.tokens.find` instead
   *
   * Get a list of OAuth1 tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth1 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth1 tokens for any account
   */
  getTokens(options?: OptionsWithRql): Promise<PagedResult<OAuth1Token>>;

  /**
   * @deprecated Use `exh.auth.oauth1.tokens.remove` instead
   *
   * Remove a token
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only remove OAuth1 tokens for this account
   * DELETE_AUTHORIZATIONS | | Can remove any OAuth1 tokens of any account
   */
  removeToken(tokenId: string): Promise<AffectedRecords>;
}

export interface AuthOauth1TokenService {
  /**
   * Get a list of OAuth1 tokens
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth1 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth1 tokens for any account
   */
  find(options?: OptionsWithRql): Promise<PagedResult<OAuth1Token>>;

  /**
   * Get the first OAuth1 token found
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth1 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth1 tokens for any account
   */
  findFirst(options?: OptionsWithRql): Promise<OAuth1Token>;

  /**
   * Get an oAuth1 token by its id
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only see a list of OAuth1 tokens for this account
   * VIEW_AUTHORIZATIONS | global | Can see a list of OAuth1 tokens for any account
   */
  findById(id: string, options?: OptionsWithRql): Promise<OAuth1Token>;

  /**
   * Remove a token
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Can only remove OAuth1 tokens for this account
   * DELETE_AUTHORIZATIONS | | Can remove any OAuth1 tokens of any account
   */
  remove(id: string): Promise<AffectedRecords>;
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
