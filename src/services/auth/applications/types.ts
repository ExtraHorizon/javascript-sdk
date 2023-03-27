import {
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../../../types';

export interface AuthApplicationsService {
  /**
   * ## Create a new application
   * You can use this function to create a new `oAuth1` or `oAuth2` application.
   *
   * You need permissions to use this function.
   *
   * #### Global Permissions
   * `CREATE_APPLICATIONS` - Provides the ability to create new applications.
   *
   * @param data {@link OAuth1ApplicationCreation} or {@link OAuth2ApplicationCreation}
   * @returns The newly created {@link OAuth1Application} or {@link OAuth2Application}.
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link FieldFormatError} when one of the provided parameters is not correctly formatted according to the documentation.
   */
  create<T extends OAuth1ApplicationCreation | OAuth2ApplicationCreation>(
    data: T,
    options?: OptionsBase
  ): Promise<
    T extends OAuth1ApplicationCreation ? OAuth1Application : OAuth2Application
  >;
  /**
   * ## Get a list of applications
   * Provides a paginated list of applications currently registered in the cluster.
   *
   * Every logged-in user is able to retrieve a limited set of fields (only `name`, `description`, `logo` and `type').
   *
   * #### Global Permissions
   * `VIEW_APPLICATIONS` - Returns all applications fields
   *
   * #### Function details
   * @param options {@link OptionsWithRql} addional options with rql that can be set for your request to the cluster.
   *
   * @returns Provides a paginated list of applications currently registered in the cluster.
   *
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * */
  get(
    options?: OptionsWithRql
  ): Promise<PagedResult<OAuth1Application | OAuth2Application>>;
  /**
   * ## Update an existing application
   * You can use this function to update an existing `oAuth1` or `oAuth2` application.
   *
   * You need permissions to use this function.
   *
   * #### Global Permissions
   * `UPDATE_APPLICATIONS` - Provides the ability to update existing applications.
   *
   * #### Function details
   * @param applicationId A hexadecimal identifier of 24 characters of the application you want to update.
   * @param data {@link OAuth1ApplicationUpdate} or {@link OAuth2ApplicationUpdate} containing the fields you want to update.
   * The fields that are left undefined will not be updated.
   * @param options {@link OptionsBase} addional options that can be set for your request to the cluster.
   *
   * @returns {Promise} A Promise with the number of affected records.
   *
   * @throws {@link ResourceUnknownError} when no application is found for the specified application Id.
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link FieldFormatError} when one of the provided parameters is not correctly formatted according to the documentation.
   */
  update<T extends OAuth1ApplicationUpdate | OAuth2ApplicationUpdate>(
    applicationId: string,
    data: T,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * ## Delete an application
   * You can use this function to remove an existing `oAuth1` or `oAuth2` application.
   *
   * You need permissions to use this function.
   *
   * #### Global permisions
   * `DELETE_APPLICATIONS` - Provides the ability to remove the applications.
   *
   * #### Function details
   * @param applicationId A hexadecimal identifier of 24 characters of the application you want to remove.
   * @param options {@link OptionsBase} addional options that can be set for your request to the cluster.
   *
   * @returns {Promise} A Promise with the number of affected records.
   *
   * @throws {@link ResourceUnknownError} when no application is found for the specified application Id.
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   */
  remove(
    applicationId: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * ## Create an application version
   * You can use this function to create a new application version.
   *
   * You need permissions to use this function.
   *
   * #### Global permissions
   * `CREATE_APPLICATIONS`- Provides the ability to create new application versions.
   *
   * #### Function details
   * @param applicationId A hexadecimal identifier of 24 characters of the application.
   * @param data An {@link ApplicationVersionCreation} object
   * @param options {@link OptionsBase} addional options that can be set for your request to the cluster.
   *
   * @returns The newly created {@link OAuth1ApplicationVersion} or {@link OAuth2ApplicationVersion}.
   *
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   * @throws {@link FieldFormatError} when one of the provided parameters is not correctly formatted according to the documentation.
   */
  createVersion(
    applicationId: string,
    data: ApplicationVersionCreation,
    options?: OptionsBase
  ): Promise<ApplicationVersion>;
  /**
   * ## Delete an application version
   * You can use this function to remove an existing appliction version.
   *
   * When you remove an application version users with existing oAuth1 tokens trying to communicate with the cluster will receive a `OAUTH_KEY_EXCEPTION`.
   * In case of oAuth2 tokens users will receive a `OAUTH2_CLIENT_ID_EXCEPTION` when trying to use their refresh token to get new access tokens.
   * You can use the error's above to force users to switch to a newer version of your applications in case the backend no longer recoginizes them.
   *
   * You need permissions to execute this function
   *
   * #### Global permissions
   * `DELETE_APPLICATIONS` - Provides the ability to remove application versions.
   *
   * #### Function details
   * @param applicationId A hexadecimal identifier of 24 characters of the application.
   * @param versionId the version Identifier or `name` of the application version.
   * @param options {@link OptionsBase} addional options that can be set for your request to the cluster.
   *
   * @returns {Promise} A Promise with the number of affected records.
   *
   * @throws {ResourceUnknownError} when the specified application or version could not be found
   * @throws {@link NoPermissionError} when the user doesn't have the required permissions to execute the function.
   */
  deleteVersion(
    applicationId: string,
    versionId: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}
/**
 * @name Application
 */
export interface Application {
  /** A 24 character long hexadecimal value acting as the identifier of your application */
  id?: string;
  /** The name of your application. A minimum 1 and maximm of 100 characters is accepted */
  name?: string;
  /** A Description of your application. A minimum 1 and maximm of 250 characters is accepted */
  description?: string;
  /** The timestamp when the application was last updated */
  updateTimestamp?: Date;
  /** The timestamp when the application was created */
  creationTimestamp?: Date;
}

export interface OAuth1Application extends Application {
  /** type of the application */
  type?: 'oauth1';
  /** A List cointaining the different versions of the application */
  versions?: OAuth1ApplicationVersion[];
}

export interface OAuth2Application extends Application {
  /** type of the application */
  type: 'oauth2';
  /** A List containing the different versions of the application */
  versions?: OAuth2ApplicationVersion[];
  /**
   * @deprecated
   * The logo of the application. Can be used in the oAuth2.0 authorization code grant to indicate the user what application he is authorizing.
   * A hexadecimal value with a minimum of 1 and maximum of 100 characters is allowed.
   * */
  logo?: string;
  /** A list of approved uri's that can be used when authenticating with [an authorization code grant flow](https://www.rfc-editor.org/rfc/rfc6749#section-1.3.1). Can only be used in an oAuth2 application type. A minimum of 1 uri and maximum 50 uri's can be provided. This field is required upon creation to the application */
  redirectUris?: string[];
  /**
   * Defines wether your application should be considered a confidential app according to the [oAuth2.0 spec](https://www.rfc-editor.org/rfc/rfc6749). If not provided upon creation this value defaults to false.
   */
  confidential?: boolean;
}

export type ApplicationCreation = Required<
  Pick<Application, 'name' | 'description'>
>;

export type OAuth1ApplicationCreation = ApplicationCreation &
  Required<Pick<OAuth1Application, 'type'>>;

export type OAuth2ApplicationCreation = ApplicationCreation &
  Required<Pick<OAuth2Application, 'type' | 'redirectUris'>> &
  Pick<OAuth2Application, 'logo' | 'confidential'>;

export interface ApplicationVersion {
  /** The identifier of this version */
  id?: string;
  /** The name of the application version. We suggest using semantic versioning vX.X.X (e.g. v1.2.0) */
  name?: string;
  /** The timestap when this version was created */
  creationTimestamp?: Date;
}

export interface OAuth1ApplicationVersion extends ApplicationVersion {
  /** the oAuth1 consumerKey */
  consumerKey?: string;
  /** the oAuth1 consumerSecret */
  consumerSecret?: string;
}

export interface OAuth2ApplicationVersion extends ApplicationVersion {
  /** The oAuth2 clientId */
  clientId?: string;
  /** The oAuth2 clientSecret */
  clientSecret?: string;
}

export type ApplicationUpdate = Pick<Application, 'name' | 'description'>;

export type OAuth1ApplicationUpdate = ApplicationUpdate &
  Required<Pick<OAuth1Application, 'type'>>;

export type OAuth2ApplicationUpdate = ApplicationUpdate &
  Required<Pick<OAuth2Application, 'type'>> &
  Pick<OAuth2Application, 'logo' | 'redirectUris'>;

export type ApplicationVersionCreation = Required<
  Pick<ApplicationVersion, 'name'>
>;
