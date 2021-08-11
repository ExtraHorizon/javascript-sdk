import { AuthParams, ClientParams, ParamsOauth1, ParamsOauth2 } from './types';
import { version as packageVersion } from './version';

import {
  usersService,
  authService,
  dataService,
  tasksService,
  filesService,
  configurationsService,
  templatesService,
  mailsService,
  dispatchersService,
  paymentsService,
  localizationsService,
  profilesService,
  notificationsService,
  eventsService,
} from './services';

import {
  createHttpClient,
  createOAuth1HttpClient,
  parseAuthParams,
  createOAuth2HttpClient,
} from './http';
import { validateConfig } from './utils';
import { OAuthClient, TokenDataOauth1 } from './http/types';

export interface OAuth1Authenticate {
  /**
   * Use OAuth1 Token authentication
   * @example
   * await sdk.auth.authenticate({
   *  token: '',
   *  tokenSecret: '',
   * });
   * @throws {ApplicationNotAuthenticatedError}
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   * @throws {MfaRequiredError}
   */
  authenticate(oauth: {
    token: string;
    tokenSecret: string;
    skipTokenCheck?: boolean;
  }): Promise<TokenDataOauth1>;
  /**
   * Use OAuth1 Password authentication
   * @example
   * await sdk.auth.authenticate({
   *  email: '',
   *  password: '',
   * });
   * @throws {ApplicationNotAuthenticatedError}
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   * @throws {MfaRequiredError}
   */
  authenticate(oauth: {
    email: string;
    password: string;
  }): Promise<TokenDataOauth1>;
}

export interface OAuth2Authenticate {
  /**
   * Use OAuth2 Authorization Code Grant flow with callback
   * @example
   * await sdk.auth.authenticate({
   *  code: '',
   *  redirectUri: '',
   * });
   * @throws {InvalidRequestError}
   * @throws {InvalidGrantError}
   * @throws {UnsupportedGrantTypeError}
   * @throws {MfaRequiredError}
   * @throws {InvalidClientError}
   */
  authenticate(oauth: { code: string; redirectUri: string }): Promise<void>;
  /**
   * Use OAuth2 Password Grant flow
   * @example
   * await sdk.auth.authenticate({
   *  password: '',
   *  username: '',
   * });
   * @throws {InvalidRequestError}
   * @throws {InvalidGrantError}
   * @throws {UnsupportedGrantTypeError}
   * @throws {MfaRequiredError}
   * @throws {InvalidClientError}
   */
  authenticate(oauth: { username: string; password: string }): Promise<void>;
  /**
   * Use OAuth2 Refresh Token Grant flow
   * @example
   * await sdk.auth.authenticate({
   *  refreshToken: '',
   * });
   * @throws {InvalidRequestError}
   * @throws {InvalidGrantError}
   * @throws {UnsupportedGrantTypeError}
   * @throws {MfaRequiredError}
   * @throws {InvalidClientError}
   */
  authenticate(oauth: { refreshToken: string }): Promise<void>;
}

type Authenticate<T extends ClientParams = ParamsOauth1> =
  T extends ParamsOauth1 ? OAuth1Authenticate : OAuth2Authenticate;

export interface Client<T extends ClientParams> {
  raw: OAuthClient;
  /**
   * The template service manages templates used to build emails. It can be used to retrieve, create, update or delete templates as well as resolving them.
   * @see https://developers.extrahorizon.io/services/?service=templates-service&redirectToVersion=1
   */
  templates: ReturnType<typeof templatesService>;
  /**
   * Provides mail functionality for other services.
   * @see https://developers.extrahorizon.io/services/?service=mail-service&redirectToVersion=1
   */
  mails: ReturnType<typeof mailsService>;
  /**
   * A flexible data storage for structured data. Additionally, the service enables you to configure a state machine for instances of the structured data. You can couple actions that need to be triggered by the state machine, when/as the entities (instance of structured data) change their state. Thanks to these actions you can define automation rules (see later for more in depth description). These actions also make it possible to interact with other services.
   * @see https://developers.extrahorizon.io/services/?service=data-service&redirectToVersion=1
   */
  data: ReturnType<typeof dataService>;
  /**
   * A service that handles file storage, metadata & file retrieval based on tokens.
   * @see https://developers.extrahorizon.io/services/?service=files-service&redirectToVersion=1
   */
  files: ReturnType<typeof filesService>;
  /**
   * Start functions on demand, directly or at a future moment.
   * @see https://developers.extrahorizon.io/services/?service=tasks-service&redirectToVersion=1
   */
  tasks: ReturnType<typeof tasksService>;
  /**
   * Provides storage for custom configuration objects. On different levels (general, groups, users, links between groups and users).
   * @see https://developers.extrahorizon.io/services/?service=configurations-service&redirectToVersion=2
   */
  configurations: ReturnType<typeof configurationsService>;
  /**
   * Configure actions that need to be invoked when a specific event is/was triggered.
   * @see https://developers.extrahorizon.io/services/?service=dispatchers-service&redirectToVersion=1
   */
  dispatchers: ReturnType<typeof dispatchersService>;
  /**
   * A service that provides payment functionality.
   * @see https://developers.extrahorizon.io/services/?service=payments-service&redirectToVersion=1
   */
  payments: ReturnType<typeof paymentsService>;
  /**
   * Storage and retrieval of text snippets, translated into multiple languages.
   * @see https://developers.extrahorizon.io/services/?service=localizations-service&redirectToVersion=1
   */
  localizations: ReturnType<typeof localizationsService>;
  /**
   * Storage service of profiles. A profile is a separate object on its own, comprising medical information like medication and medical history, as well as technical information, like what phone a user is using.
   * @see https://developers.extrahorizon.io/services/?service=profiles-service&redirectToVersion=1
   */
  profiles: ReturnType<typeof profilesService>;
  /**
   * A service that handles push notifications.
   * @see https://developers.extrahorizon.io/services/?service=notifications-service&redirectToVersion=1
   */
  notifications: ReturnType<typeof notificationsService>;
  /**
   * Service that provides event (publish/subscribe) functionality for other services.
   * @see https://developers.extrahorizon.io/services/?service=events-service&redirectToVersion=1
   */
  events: ReturnType<typeof eventsService>;
  /**
   * The user service stands in for managing users themselves, as well as roles related to users and groups of users.
   * @see https://developers.extrahorizon.io/services/?service=users-service&redirectToVersion=1
   */
  users: ReturnType<typeof usersService>;
  /**
   * Provides authentication functionality. The Authentication service supports both OAuth 1.0a and OAuth 2.0 standards.
   * @see https://developers.extrahorizon.io/services/?service=auth-service&redirectToVersion=2
   */
  auth: ReturnType<typeof authService> &
    Pick<OAuthClient, 'confirmMfa' | 'logout'> &
    Authenticate<T>;
}

/**
 * Create ExtraHorizon client.
 *
 * @example
 * const sdk = createClient({
 *   host: 'xxx.fibricheck.com',
 *   clientId: 'string',
 * });
 * await sdk.auth.authenticate({
 *   username: 'string',
 *   password: 'string',
 * });
 */
export function createClient<T extends ClientParams>(rawConfig: T): Client<T> {
  const config = validateConfig(rawConfig);
  const http = createHttpClient({ ...config, packageVersion });

  const httpWithAuth =
    'oauth1' in config
      ? createOAuth1HttpClient(http, config)
      : createOAuth2HttpClient(http, config);

  return {
    users: usersService(httpWithAuth),
    data: dataService(httpWithAuth),
    files: filesService(httpWithAuth),
    tasks: tasksService(httpWithAuth),
    templates: templatesService(httpWithAuth),
    mails: mailsService(httpWithAuth),
    configurations: configurationsService(httpWithAuth),
    dispatchers: dispatchersService(httpWithAuth),
    payments: paymentsService(httpWithAuth),
    localizations: localizationsService(httpWithAuth),
    profiles: profilesService(httpWithAuth),
    notifications: notificationsService(httpWithAuth),
    events: eventsService(httpWithAuth),
    auth: {
      ...authService(httpWithAuth),
      authenticate: (oauth: AuthParams) =>
        httpWithAuth.authenticate(parseAuthParams(oauth)),
      confirmMfa: httpWithAuth.confirmMfa,
      logout: httpWithAuth.logout,
    } as any,
    raw: httpWithAuth,
  };
}

export type OAuth1Client = Client<ParamsOauth1>;
/**
 * Create ExtraHorizon OAuth1 client.
 *
 * @example
 * const sdk = createOAuth1Client({
 *   host: 'dev.fibricheck.com',
 *   consumerKey: 'string',
 *   consumerSecret: 'string',
 * });
 * await sdk.auth.authenticate({
 *   email: 'string',
 *   password: 'string',
 * });
 */
export const createOAuth1Client = (rawConfig: ParamsOauth1): OAuth1Client =>
  createClient(rawConfig);

export type OAuth2Client = Client<ParamsOauth2>;
/**
 * Create ExtraHorizon OAuth2 client.
 *
 * @example
 * const sdk = createOAuth2Client({
 *   host: 'dev.fibricheck.com',
 *   clientId: 'string',
 * });
 * await sdk.auth.authenticate({
 *   username: 'string',
 *   password: 'string',
 * });
 */
export const createOAuth2Client = (rawConfig: ParamsOauth2): OAuth2Client =>
  createClient(rawConfig);
