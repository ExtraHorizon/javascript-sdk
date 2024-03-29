import {
  createHttpClient,
  createOAuth1HttpClient,
  createOAuth2HttpClient,
  createProxyHttpClient,
} from './http';
import {
  AuthHttpClient,
  OAuth1HttpClient,
  OAuth2HttpClient,
  ProxyInstance,
} from './http/types';
import {
  authService,
  configurationsService,
  dataService,
  dispatchersService,
  eventsService,
  filesService,
  localizationsService,
  logsService,
  mailsService,
  notificationsService,
  paymentsService,
  profilesService,
  tasksService,
  templatesService,
  usersService,
} from './services';
import { ClientParams, ParamsOauth1, ParamsOauth2, ParamsProxy } from './types';
import { validateConfig } from './utils';
import { version as packageVersion } from './version';

export interface Client<T extends ClientParams> {
  raw: AuthHttpClient;
  /**
   * The template service manages templates used to build emails. It can be used to retrieve, create, update or delete templates as well as resolving them.
   * @see https://swagger.extrahorizon.com/listing/?service=templates-service&redirectToVersion=1
   */
  templates: ReturnType<typeof templatesService>;
  /**
   * Provides mail functionality for other services.
   * @see https://swagger.extrahorizon.com/listing/?service=mail-service&redirectToVersion=1
   */
  mails: ReturnType<typeof mailsService>;
  /**
   * A flexible data storage for structured data. Additionally, the service enables you to configure a state machine for instances of the structured data. You can couple actions that need to be triggered by the state machine, when/as the entities (instance of structured data) change their state. Thanks to these actions you can define automation rules (see later for more in depth description). These actions also make it possible to interact with other services.
   * @see https://swagger.extrahorizon.com/listing/?service=data-service&redirectToVersion=1
   */
  data: ReturnType<typeof dataService>;
  /**
   * A service that handles file storage, metadata & file retrieval based on tokens.
   * @see https://swagger.extrahorizon.com/listing/?service=files-service&redirectToVersion=1
   */
  files: ReturnType<typeof filesService>;
  /**
   * Start functions on demand, directly or at a future moment.
   * @see https://swagger.extrahorizon.com/listing/?service=tasks-service&redirectToVersion=1
   */
  tasks: ReturnType<typeof tasksService>;
  /**
   * Provides storage for custom configuration objects. On different levels (general, groups, users, links between groups and users).
   * @see https://swagger.extrahorizon.com/listing/?service=configurations-service&redirectToVersion=2
   */
  configurations: ReturnType<typeof configurationsService>;
  /**
   * Configure actions that need to be invoked when a specific event is/was triggered.
   * @see https://swagger.extrahorizon.com/listing/?service=dispatchers-service&redirectToVersion=1
   */
  dispatchers: ReturnType<typeof dispatchersService>;
  /**
   * A service that provides payment functionality.
   * @see https://swagger.extrahorizon.com/listing/?service=payments-service&redirectToVersion=1
   */
  payments: ReturnType<typeof paymentsService>;
  /**
   * Storage and retrieval of text snippets, translated into multiple languages.
   * @see https://swagger.extrahorizon.com/listing/?service=localizations-service&redirectToVersion=1
   */
  localizations: ReturnType<typeof localizationsService>;
  /**
   * Storage service of profiles. A profile is a separate object on its own, comprising medical information like medication and medical history, as well as technical information, like what phone a user is using.
   * @see https://swagger.extrahorizon.com/listing/?service=profiles-service&redirectToVersion=1
   */
  profiles: ReturnType<typeof profilesService>;
  /**
   * A service that handles push notifications.
   * @see https://swagger.extrahorizon.com/listing/?service=notifications-service&redirectToVersion=1
   */
  notifications: ReturnType<typeof notificationsService>;
  /**
   * Service that provides event (publish/subscribe) functionality for other services.
   * @see https://swagger.extrahorizon.com/listing/?service=events-service&redirectToVersion=1
   */
  events: ReturnType<typeof eventsService>;
  /**
   * The user service stands in for managing users themselves, as well as roles related to users and groups of users.
   * @see https://swagger.extrahorizon.com/listing/?service=users-service&redirectToVersion=1
   */
  users: ReturnType<typeof usersService>;
  /**
   * The logs service allows an authorized party to retrieve logs of the system.
   * @see https://swagger.extrahorizon.com/listing/?service=logs-service&redirectToVersion=1
   */
  logs: ReturnType<typeof logsService>;
  /**
   * Provides authentication functionality. The Authentication service supports both OAuth 1.0a and OAuth 2.0 standards.
   * @see https://swagger.extrahorizon.com/listing/?service=auth-service&redirectToVersion=2
   */
  auth: T extends ParamsOauth1
    ? ReturnType<typeof authService> & OAuth1HttpClient['extraAuthMethods']
    : T extends ParamsOauth2
    ? ReturnType<typeof authService> & OAuth2HttpClient['extraAuthMethods']
    : ReturnType<typeof authService> & ProxyInstance['extraAuthMethods'];
}

/**
 * Create ExtraHorizon client.
 *
 * @example
 * const exh = createClient({
 *   host: 'xxx.extrahorizon.io',
 *   clientId: 'string',
 * });
 * await exh.auth.authenticate({
 *   username: 'string',
 *   password: 'string',
 * });
 */
export function createClient<T extends ClientParams>(rawConfig: T): Client<T> {
  const config = validateConfig(rawConfig);
  const http = createHttpClient({ ...config, packageVersion });

  const httpWithAuth = (() => {
    if ('consumerKey' in config) {
      return createOAuth1HttpClient(http, config);
    }
    if ('clientId' in config) {
      return createOAuth2HttpClient(http, config);
    }
    return createProxyHttpClient(http, config);
  })();

  return {
    users: usersService(httpWithAuth, http),
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
    logs: logsService(httpWithAuth),
    auth: {
      ...authService(httpWithAuth),
      ...httpWithAuth.extraAuthMethods,
    } as any,
    raw: httpWithAuth,
  };
}

export type OAuth1Client = Client<ParamsOauth1>;
/**
 * Create ExtraHorizon OAuth1 client.
 *
 * @example
 * const exh = createOAuth1Client({
 *   host: 'dev.extrahorizon.io',
 *   consumerKey: 'string',
 *   consumerSecret: 'string',
 * });
 * await exh.auth.authenticate({
 *   email: 'string',
 *   password: 'string',
 * });
 */
export const createOAuth1Client = (rawConfig: ParamsOauth1): OAuth1Client => createClient(rawConfig);

export type OAuth2Client = Client<ParamsOauth2>;
/**
 * Create ExtraHorizon OAuth2 client.
 *
 * @example
 * const exh = createOAuth2Client({
 *   host: 'dev.extrahorizon.io',
 *   clientId: 'string',
 * });
 * await exh.auth.authenticate({
 *   username: 'string',
 *   password: 'string',
 * });
 */
export const createOAuth2Client = (rawConfig: ParamsOauth2): OAuth2Client => createClient(rawConfig);

export type ProxyClient = Client<ParamsProxy>;
/**
 * Create ExtraHorizon Proxy client.
 *
 * @example
 * const exh = createProxyClient({
 *   host: 'apx.dev.extrahorizon.io',
 * });
 */
export const createProxyClient = (rawConfig: ParamsProxy): ProxyClient => createClient(rawConfig);
