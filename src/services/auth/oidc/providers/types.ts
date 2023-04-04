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
  create(body: OidcProviderCreation): Promise<OidcProviderResponse>;

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
  /** ###The Extra Horizon OpenID Connect provider identifier */
  id: string;
  /** ###The user-friendly and unique name of the provider
   * **Validation:**
   * - Minimum Length: 3 characters
   * - Maximum Length: 40 characters
   * - Matches pattern: /^[a-zA-Z0-9_-]+$/ */
  name: string;
  /** ###A brief description of the provider
   * **Validation:**
   * - Maximum Length: 256 characters */
  description: string;
  /**  ###Obtained from the OpenID Connect application on registration (client_id)
   * **Validation:**
   * - Maximum Length: 256 characters */
  clientId: string;
  /**  ###Obtained from the OpenID Connect application on registration (Issuer / iss)
   * **Validation:**
   * - Maximum Length: 2048 characters */
  issuerId: string;
  /**  ###Allows a user to sign in to the OpenID Connect application and retrieve an authorization_code
   * **Validation:**
   * - The user can sign in to retrieve an authorization_code
   * - Maximum Length: 2048 characters
   *
   * **Notes:**
   * - The authorization endpoint is obtained from the OpenID application on registration
   * */
  authorizationEndpoint: string;
  /**
   * ###ALlows a user to exchange an authorization_code for access tokens with the provider
   * **Validation:**
   * - Maximum length: 2048 characters
   *
   * **Notes:**
   * - The token endpoint is obtained from the OpenID application on registration
   */
  tokenEndpoint: string;
  /**
   * ###ALlows a user to exchange an authorization_code for personal information with the provider
   *
   * **Validation:**
   * - Maximum length: 2048 characters
   *
   * **Notes:**
   * - The user info endpoint is obtained from the OpenID application on registration
   * - The returned user information is defined by the OpenID Connect provider */
  userinfoEndpoint: string;
  /**
   * ###Redirects the user to the provided URL after a successful user sign in
   *
   * **Validation:**
   * - Must match a redirect URL provided to the OpenID connect application on creation
   * - Maximum length: 2048 characters
   * */
  redirectUri: string;
  /** ### Indicates if the OpenID Connect provider is active
   * **Notes:**
   * - Disabling a provider will not remove the users linked to it
   * - Disabling a provider will not terminate active user sessions
   * */
  enabled: boolean;
  /** ###  Obtained from the OpenID Connect application on registration (client_secret)
   * **validation:**
   * - Maximum Length: 2048 characters */
  clientSecret: string;
  /** ###The creation timestamp of the OpenID Connect provider */
  creationTimestamp: Date;
  /** ###The last updated timestamp of the OpenID Connect provider */
  updateTimestamp: Date;
}

export type OidcProviderCreation = Omit<
  OidcProvider,
  'id' | 'enabled' | 'creationTimestamp' | 'updateTimestamp'
>;
export type OidcProviderResponse = Omit<OidcProvider, 'clientSecret'> & {
  /** ###The last four characters of the client secret */
  clientSecretHint: string;
};
export type OidcProviderUpdate = Partial<OidcProviderCreation>;
