import {
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';
import {
  OidcLinkRequestBody,
  OidcProviderCreation,
  OidcProviderResponse,
  OidcProviderUpdate,
} from './oidcTypes';

export interface Timestamp {
  updateTimestamp: Date;
  creationTimestamp: Date;
}
export interface OAuth1ApplicationVersion {
  id: string;
  name: string;
  consumerKey: string;
  consumerSecret: string;
  creationTimestamp: Date;
}

export interface OAuth1Application extends Timestamp {
  id: string;
  name: string;
  description: string;
  type: string; // 'oauth1';
  versions: OAuth1ApplicationVersion[];
}

export interface OAuth2ApplicationVersion {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  creationTimestamp: Date;
}

export interface OAuth2Application extends Timestamp {
  id: string;
  name: string;
  description: string;
  type: string; // 'oauth2';
  versions?: OAuth2ApplicationVersion[];
  logo?: string;
  redirectUris: string[];
  confidential?: boolean;
}

export type Application<T = false> = T extends OAuth1ApplicationCreationSchema
  ? OAuth1Application
  : T extends OAuth2ApplicationCreationSchema
  ? OAuth2Application
  : OAuth1Application | OAuth2Application;

export type OAuth1ApplicationCreationSchema = Pick<
  OAuth1Application,
  'type' | 'name' | 'description'
>;

export type OAuth2ApplicationCreationSchema = Pick<
  OAuth2Application,
  'type' | 'name' | 'description' | 'logo' | 'redirectUris' | 'confidential'
>;

export type ApplicationCreation =
  | OAuth1ApplicationCreationSchema
  | OAuth2ApplicationCreationSchema;

export type OAuth1ApplicationUpdateSchema = Pick<
  OAuth1Application,
  'type' | 'name' | 'description'
>;

export type OAuth2ApplicationUpdateSchema = Pick<
  OAuth2Application,
  'type' | 'name' | 'description' | 'logo' | 'redirectUris'
>;

export type ApplicationUpdate =
  | OAuth1ApplicationUpdateSchema
  | OAuth2ApplicationUpdateSchema;

export interface ApplicationVersionCreation {
  name: string;
}

export type ApplicationVersion<T = false> = T extends OAuth1Application
  ? OAuth1ApplicationVersion
  : T extends OAuth2Application
  ? OAuth2ApplicationVersion
  : OAuth1ApplicationVersion | OAuth2ApplicationVersion;

export interface OAuth2AuthorizationCreation {
  responseType: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
}

export interface OAuth2Authorization extends Timestamp {
  id: string;
  userId: string;
  clientId: string;
  authorizationCode: string;
  state: string;
}

export interface RecoveryCodesMethod extends Timestamp {
  id: string;
  name: string;
  tags: string[];
  verified: boolean;
  type: string; // recoveryCodes
  codes: string[];
}

export interface TotpMethod {
  id: string;
  name: string;
  tags: string[];
  verified: boolean;
  type: string; // totp
  secret: string;
}

export type MfaMethod = RecoveryCodesMethod | TotpMethod;

export interface MfaSetting {
  id: string;
  methods: [MfaMethod];
  enabled: boolean;
  updateTimestamp: Date;
}

export interface Presence extends Timestamp {
  token: string;
}

export interface MfaMethodCreation {
  presenceToken: string;
  type: string; // totp or recoveryCodes
  name: string;
  tags: string[];
}

export interface MfaMethodVerification {
  presenceToken: string;
  code: string;
}

export interface PresenceToken {
  presenceToken: string;
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

export interface AuthApplicationsService {
  /**
   * Create an OAuth application
   *
   * Permission | Scope | Effect
   * - | - | -
   * CREATE_APPLICATIONS | global | Required for this endpoint
   * @async
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications
   */
  create<T extends ApplicationCreation>(
    data: T,
    options?: OptionsBase
  ): Promise<Application<T>>;
  /**
   * Get a list of applications
   *
   * Permission | Scope | Effect
   * - | - | -
   * none| | 	Returns a limited set of fields of the list (only name, description, logo and type fields)
   * VIEW_APPLICATIONS | global | Returns all fields of the list
   * @async
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Applications/get_applications
   * */
  get(options?: OptionsWithRql): Promise<PagedResult<Application>>;
  /**
   * Update an OAuth application
   *
   * Permission | Scope | Effect
   * - | - | -
   * UPDATE_APPLICATIONS | global |
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Applications/put_applications
   * @throws {ResourceUnknownError}
   */
  update(
    applicationId: string,
    data: ApplicationUpdate,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete an OAuth application
   *
   * Permission | Scope | Effect
   * - | - | -
   * DELETE_APPLICATIONS | global | **Required** for this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId_
   * @throws {ResourceUnknownError}
   */
  remove(
    applicationId: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Create an application version
   *
   * Permission | Scope | Effect
   * - | - | -
   * CREATE_APPLICATIONS | global | **Required** for this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications__applicationId__versions
   */
  createVersion<T extends Application>(
    applicationId: string,
    data: ApplicationVersionCreation,
    options?: OptionsBase
  ): Promise<ApplicationVersion<T>>;
  /**
   * Delete an application version
   *
   * Permission | Scope | Effect
   * - | - | -
   * DELETE_APPLICATIONS | global | **Required** for this endpoint
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId__versions__versionId_
   * @throws {ResourceUnknownError}
   */
  deleteVersion(
    applicationId: string,
    versionId: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

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

export interface AuthUsersService {
  /**
   * View the MFA settings of a user (or create the settings if they have none)
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See your own MFA settings
   * VIEW_USER_MFA_SETTINGS | global | See anyone their MFA settings
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/get_mfa_users__userId_
   */
  getMfaSetting(userId: string, options?: OptionsBase): Promise<MfaSetting>;
  /**
   * Enable MFA for a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none	|	| Enable MFA for your own account
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__enable
   * @throws {InvalidPresenceTokenError}
   * @throws {NotEnoughMfaMethodsError}
   */
  enableMfa(
    userId: string,
    data: PresenceToken,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Disable MFA for a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Disable MFA for your own account
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
   * @throws {InvalidPresenceTokenError}
   */
  disableMfa(
    userId: string,
    data: PresenceToken,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Add a MFA method to a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Add a MFA method to your user
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
   * @throws {InvalidPresenceTokenError}
   */
  addMfaMethod(
    userId: string,
    data: MfaMethodCreation,
    options?: OptionsBase
  ): Promise<MfaMethod>;
  /**
   * Confirm the correct functioning of a MFA method
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Confirm a MFA method for your user
   * UPDATE_USER_MFA_SETTINGS | global | Confirm a MFA method for any user
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__methods__methodId__verification_confirm
   * @throws {ResourceUnknownError}
   * @throws {IllegalArgumentError}
   * @throws {InvalidMfaCodeError}
   * @throws {InvalidPresenceTokenError}
   */
  confirmMfaMethodVerification(
    userId: string,
    methodId: string,
    data: MfaMethodVerification,
    options?: OptionsBase
  ): Promise<{ description: string }>;
  /**
   * Remove a MFA method from a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Remove a MFA method for your user
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__methods__methodId__remove
   * @throws {NotEnoughMfaMethodsError}
   * @throws {InvalidPresenceTokenError}
   */
  removeMfaMethod(
    userId: string,
    methodId: string,
    data: PresenceToken,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}
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

export interface OidcService {
  /**
   * Create an OpenId Connect Provider
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_OIDC_PROVIDER` | `global` | **Required** for this endpoint
   */
  createProvider(
    requestBody: OidcProviderCreation
  ): Promise<OidcProviderResponse>;

  /**
   * Get a list of OpenId Connect Providers
   * @param rql Add filters to the requested list.
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_OIDC_PROVIDERS` | `global` | **Required** for this endpoint
   */
  getProviders(
    options?: OptionsWithRql
  ): Promise<PagedResult<OidcProviderResponse>>;

  /**
   * Update an OpenId Connect Provider
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_OIDC_PROVIDER` | `global` | **Required** for this endpoint
   */
  updateProvider(
    providerId: string,
    requestBody: OidcProviderUpdate
  ): Promise<AffectedRecords>;

  /**
   * Delete a OpenId Connect Provider
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_OIDC_PROVIDER` | `global` | **Required** for this endpoint
   */
  deleteProvider(providerId: string): Promise<AffectedRecords>;

  /**
   * Enable a provider
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_OIDC_PROVIDER` | `global` | **Required** for this endpoint
   */
  enableProvider(providerId: string): Promise<AffectedRecords>;

  /**
   * Disable a provider
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_OIDC_PROVIDER` | `global` | **Required** for this endpoint
   */
  disableProvider(providerId: string): Promise<AffectedRecords>;

  /**
   * Link the currently logged-in user to an OIDC provider
   * Permission | Scope | Effect
   * - | - | -
   * none | | Only a logged-in user can use this endpoint
   * @param providerName The name of the OpenID Connect provider that the user will be linked to
   * @param linkRequestBody
   * */
  linkUserToOidcProvider(
    providerName: string,
    linkRequestBody: OidcLinkRequestBody
  ): Promise<AffectedRecords>;

  /**
   * Unlink a user from OpenID Connect
   * Permission | Scope | Effect
   * - | - | -
   * UNLINK_USER_FROM_OIDC | `global` | **Required** for this endpoint
   * @param userId The id of the user to be unlinked from OpenID Connect
   */
  unlinkUserFromOidc(userId: string): Promise<AffectedRecords>;
}
