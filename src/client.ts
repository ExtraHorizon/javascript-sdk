import { AxiosInstance } from 'axios';
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
} from './services';

import {
  createHttpClient,
  createOAuth1HttpClient,
  parseAuthParams,
  createOAuth2HttpClient,
} from './http';
import { validateConfig } from './utils';

interface OAuth1Authenticate {
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
  authenticate(oauth: { token: string; tokenSecret: string }): Promise<void>;
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
  authenticate(oauth: { email: string; password: string }): Promise<void>;
}

interface OAuth2Authenticate {
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

type Authenticate<
  T extends ClientParams = ParamsOauth1
> = T extends ParamsOauth1 ? OAuth1Authenticate : OAuth2Authenticate;

export interface Client<T extends ClientParams> {
  raw: AxiosInstance;
  /**
   * The template service manages templates used to build emails. It can be used to retrieve, create, update or delete templates as well as resolving them.
   * @see https://developers.extrahorizon.io/services/templates-service/1.0.13/
   */
  templates: ReturnType<typeof templatesService>;
  /**
   * Provides mail functionality for other services.
   * @see https://developers.extrahorizon.io/services/mail-service/1.0.8-dev/
   */
  mails: ReturnType<typeof mailsService>;
  /**
   * A flexible data storage for structured data. Additionally, the service enables you to configure a state machine for instances of the structured data. You can couple actions that need to be triggered by the state machine, when/as the entities (instance of structured data) change their state. Thanks to these actions you can define automation rules (see later for more in depth description). These actions also make it possible to interact with other services.
   * @see https://developers.extrahorizon.io/services/data-service/1.0.9/
   */
  data: ReturnType<typeof dataService>;
  /**
   * A service that handles file storage, metadata & file retrieval based on tokens.
   * @see https://developers.extrahorizon.io/services/files-service/1.0.1-dev/
   */
  files: ReturnType<typeof filesService>;
  /**
   * Start functions on demand, directly or at a future moment.
   * @see https://developers.extrahorizon.io/services/tasks-service/1.0.4/
   */
  tasks: ReturnType<typeof tasksService>;
  /**
   * Provides storage for custom configuration objects. On different levels (general, groups, users, links between groups and users).
   * @see https://developers.extrahorizon.io/services/configurations-service/2.0.2-dev/
   */
  configurations: ReturnType<typeof configurationsService>;
  /**
   * Configure actions that need to be invoked when a specific event is/was triggered.
   * @see https://developers.extrahorizon.io/services/dispatchers-service/1.0.3-dev/
   */
  dispatchers: ReturnType<typeof dispatchersService>;
  /**
   * A service that provides payment functionality.
   * @see https://developers.extrahorizon.io/services/payments-service/1.1.0-dev/
   */
  payments: ReturnType<typeof paymentsService>;
  /**
   * Storage and retrieval of text snippets, translated into multiple languages.
   * @see https://developers.extrahorizon.io/services/localizations-service/1.1.6-dev/
   */
  localizations: ReturnType<typeof localizationsService>;
  /**
   * The user service stands in for managing users themselves, as well as roles related to users and groups of users.
   * @see https://developers.extrahorizon.io/services/users-service/1.1.7/
   */
  users: ReturnType<typeof usersService>;
  /**
   * Provides authentication functionality. The Authentication service supports both OAuth 1.0a and OAuth 2.0 standards.
   * @see https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/
   */
  auth: ReturnType<typeof authService> & {
    /**
     *  Confirm MFA method with token, methodId and code
     *  @example
     *  try {
     *    await sdk.auth.authenticate({
     *      password: '',
     *      username: '',
     *    });
     *  } catch (error) {
     *    if (error instanceof MfaRequiredError) {
     *      const { mfa } = error.response;
     *
     *      // Your logic to request which method the user want to use in case of multiple methods
     *      const methodId = mfa.methods[0].id;
     *
     *      await sdk.auth.confirmMfa({
     *        token: mfa.token,
     *        methodId,
     *        code: '', // code from ie. Google Authenticator
     *      });
     *    }
     *  }
     */
    confirmMfa: (mfa: {
      token: string;
      methodId: string;
      code: string;
    }) => Promise<void>;
  } & Authenticate<T>;
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
    auth: {
      ...authService(httpWithAuth),
      authenticate: (oauth: AuthParams): Promise<void> =>
        httpWithAuth.authenticate(parseAuthParams(oauth)),
      confirmMfa: httpWithAuth.confirmMfa,
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
