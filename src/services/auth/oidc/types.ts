import { AffectedRecords, OptionsWithRql, PagedResult } from '../../types';
import { LoginAttemptsService } from './loginAttempts/types';

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

  loginAttempts: LoginAttemptsService;
}

export interface BaseOidcProvider {
  /** Human friendly name of the provider, which can also be used in the oidc login urls */
  name: string;
  /** Description of the provider */
  description: string;
  /**  Required for us to validate the ID token jwt ("iss") */
  issuerId: string;
  /** Provided by the provider after registration */
  clientId: string;
  /** Only used by our customer to redirect the user to */
  authorizationEndpoint: string;
  /** Used by us to exchange the code to an ID token */
  tokenEndpoint: string;
  /** Required to get the name and email address of the user */
  userinfoEndpoint: string;
  /** Required we need to send this as well to the token endpoint */
  redirectUri: string;
}

export interface OidcProvider extends OidcProviderCreation {
  id: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
  enabled: boolean;
}

export interface OidcProviderCreation extends BaseOidcProvider {
  /** Provided by the provider after registration */
  clientSecret: string;
}

export interface OidcProviderResponse extends Partial<BaseOidcProvider> {
  id?: string;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  enabled?: boolean;
  clientSecretHint?: string;
}

export type OidcProviderUpdate = Partial<OidcProviderCreation>;

export interface OidcLinkRequestBody {
  /** Obtained from the OpenID Connect provider upon successful user login. */
  authorizationCode: string;
  /** Optional: include the nonce if it was provided in the authentication request */
  nonce?: string;
}
