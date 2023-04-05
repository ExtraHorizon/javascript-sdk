import {
  AffectedRecords,
  OptionsWithRql,
  PagedResultWithPager,
} from '../../../types';
import { FindAllIterator } from '../../../helpers';

export interface OidcProviderService {
  /**
   * ## Create a new OpenID Connect Provider
   * ###You can use this function to create a new OpenId Connect Provider to enable Single Sign On.
   *
   * **Global Permissions:**
   * `CREATE_OIDC_PROVIDER` - Allows a user to create a new OpenID Connect Provider
   *
   * @param body {@link OidcProviderCreation}
   * @returns OidcProvider {@link OidcProvider}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link FieldFormatError} when one of the provided parameters is not correctly formatted according to the documentation.
   */
  create(body: OidcProviderCreation): Promise<OidcProvider>;

  /**
   * ## Retrieve a paged list of OpenID Connect providers
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_PROVIDERS` - Allows a user to view OpenID Connect providers
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns A paged list of providers {@link PagedResultWithPager PagedResultWithPager<OidcProvider>}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<OidcProvider>>;

  /**
   * ## Retrieve a list of all OpenID Connect providers
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_PROVIDERS` - Allows a user to view OpenID Connect providers
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An array of providers {@link OidcProvider OidcProvider[]}
   * @throws {@link Error} Do not pass in limit operator with findAll
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   */
  findAll(options?: OptionsWithRql): Promise<OidcProvider[]>;

  /**
   * ## Retrieve a paged list of OpenID Connect providers
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_PROVIDERS` - Allows a user to view OpenID Connect providers
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An iterator for the queried providers {@link FindAllIterator FindAllIterator<OidcProvider>}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<OidcProvider>;

  /**
   * ## Retrieve the first queried OpenID Connect provider
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_PROVIDERS` - Allows a user to view OpenID Connect providers
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns The first element of the queried providers {@link OidcProvider}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   */
  findFirst(options?: OptionsWithRql): Promise<OidcProvider>;

  /**
   * ## Update an OpenID Connect provider
   * ###You can use this function to update an existing OpenId Connect Provider. Fields left undefined will not be updated.
   *
   * **Global Permissions:**
   * - `UPDATE_OIDC_PROVIDER` - Allows a user to update an OpenID Connect provider
   *
   * @param providerId {@link string} - The Extra Horizon provider id
   * @param body {@link OidcProviderUpdate} - The set of updatable fields for an existing provider
   * @returns An affected records promise {@link AffectedRecords}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link ResourceUnknownError} when no provider is found for the specified providerId.
   * @throws {@link FieldFormatError} when one of the provided parameters is not correctly formatted according to the documentation.
   */
  update(
    providerId: string,
    body: OidcProviderUpdate
  ): Promise<AffectedRecords>;

  /**
   * ## Delete an OpenID Connect provider
   * ###You can use this function to delete an existing OpenId Connect provider.
   *
   * **Global Permissions:**
   * - `DELETE_OIDC_PROVIDER` - Allows a user to delete an OpenID Connect provider
   *
   * @param providerId {@link string} - The Extra Horizon provider id
   * @returns An affected records response {@link AffectedRecords}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link ResourceUnknownError} when no provider is found for the specified providerId.
   * @throws {@link IllegalStateError} when the provider is enabled (Only disabled providers can be removed) or when there are still users linked to this provider.
   */
  delete(providerId: string): Promise<AffectedRecords>;

  /**
   * ## Enable an OpenID Connect provider
   *
   * **Global Permissions:**
   * - `UPDATE_OIDC_PROVIDER` - Allows a user to update an OpenID Connect provider
   *
   * @param providerId {@link string} - The Extra Horizon provider id
   * @returns An affected records response {@link AffectedRecords}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link ResourceUnknownError} when no provider is found for the specified providerId.
   */
  enable(providerId: string): Promise<AffectedRecords>;

  /**
   * ## Disable an OpenID Connect provider
   *
   * **Global Permissions:**
   * - `UPDATE_OIDC_PROVIDER` - Allows a user to update an OpenID Connect provider
   *
   * @param providerId - The Extra Horizon provider id
   * @returns An affected records response {@link AffectedRecords}
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link ResourceUnknownError} when no provider is found for the specified providerId.
   */
  disable(providerId: string): Promise<AffectedRecords>;
}

export interface OidcProvider {
  /** A 24 character long hexadecimal value acting as the identifier of an OpenId Connect provider */
  id: string;
  /** Human friendly name of the provider, which can also be used in the oidc login url. Then name can be between 3 and 40 characters and match pattern: '/^[a-zA-Z0-9_-]+$/' */
  name: string;
  /** Description of the provider. With a maximum of 256 characters */
  description: string;
  /** Provided by the OpenID Connect provider after registration. With a maximum of 2048 characters */
  clientId: string;
  /** A URL of maximum 2048 charactes that acts as a unique identifier for the provider. `Issuer` in the provider's discovery document. */
  issuerId: string;
  /** A URL of maximum 2048 character that points to the provider’s URL for authorising the user (i.e., signing the user in). authorization_endpoint in the provider's discovery document. */
  authorizationEndpoint: string;
  /** A URL of maximum 2048 character that points to the provider’s OAuth 2.0 protected URL from which user information can be obtained. token_endpoint in the provider's discovery document. */
  tokenEndpoint: string;
  /** A URL of maximum 2048 character that points to the provider’s endpoint of the authorization server Extra Horizon can use to obtain the email address and optionally also the family name and given name. userinfo_endpoint in the provider's discovery document. */
  userinfoEndpoint: string;
  /** A URL of maximum 2048 character that points to the location where the authorization server sends the user once the app has been successfully authorised and granted an authorization code or access token */
  redirectUri: string;
  /** Indicates wether the OpenID Connect provider is active and can be used for SSO */
  enabled: boolean;
  /** The last four characters of the client secret */
  clientSecretHint: string;
  /** The creation timestamp of the OpenID Connectprovider */
  creationTimestamp: Date;
  /** The update timestamp of the OpenID Connect provider */
  updateTimestamp: Date;
}

export interface OidcProviderCreation
  extends Required<
    Pick<
      OidcProvider,
      | 'name'
      | 'description'
      | 'clientId'
      | 'authorizationEndpoint'
      | 'redirectUri'
      | 'tokenEndpoint'
      | 'userinfoEndpoint'
      | 'issuerId'
    >
  > {
  /** The OAuth 2.0 Client Secret you received from your provider. Max 2048 characters */
  clientSecret: string;
}

export type OidcProviderUpdate = Partial<OidcProviderCreation>;
