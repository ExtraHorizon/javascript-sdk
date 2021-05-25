import { AxiosInstance } from 'axios';
import { AuthParams, ClientParams, ParamsOauth1 } from './types';

import {
  usersService,
  authService,
  dataService,
  tasksService,
  filesService,
  configurationService,
  templateService,
  mailService,
  dispatchersService,
} from './services';

import {
  createHttpClient,
  createOAuth1HttpClient,
  parseAuthParams,
  createOAuth2HttpClient,
} from './http';
import { validateConfig } from './utils';

export { rqlBuilder } from './rql';

export * from './errors';
export * from './types';

interface OAuth1Authenticate {
  /**
   * Use OAuth1 Token authentication
   * @example
   * await sdk.auth.authenticate({
   *  token: '',
   *  tokenSecret: '',
   * });
   */
  authenticate(oauth: { token: string; tokenSecret: string }): Promise<void>;
  /**
   * Use OAuth1 Password authentication
   * @example
   * await sdk.auth.authenticate({
   *  email: '',
   *  password: '',
   * });
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
   */
  authenticate(oauth: { code: string; redirectUri: string }): Promise<void>;
  /**
   * Use OAuth2 Password Grant flow
   * @example
   * await sdk.auth.authenticate({
   *  password: '',
   *  username: '',
   * });
   */
  authenticate(oauth: { username: string; password: string }): Promise<void>;
  /**
   * Use OAuth2 Refresh Token Grant flow
   * @example
   * await sdk.auth.authenticate({
   *  refreshToken: '',
   * });
   */
  authenticate(oauth: { refreshToken: string }): Promise<void>;
}

type Authenticate<
  T extends ClientParams = ParamsOauth1
> = T extends ParamsOauth1 ? OAuth1Authenticate : OAuth2Authenticate;

export interface Client<T extends ClientParams> {
  rawAxios: AxiosInstance;
  template: ReturnType<typeof templateService>;
  mail: ReturnType<typeof mailService>;
  data: ReturnType<typeof dataService>;
  files: ReturnType<typeof filesService>;
  tasks: ReturnType<typeof tasksService>;
  configuration: ReturnType<typeof configurationService>;
  dispatchers: ReturnType<typeof dispatchersService>;
  users: ReturnType<typeof usersService>;
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
 * const sdk = client({
 *   apiHost: 'xxx.fibricheck.com',
 *   clientId: 'string',
 * });
 * await sdk.auth.authenticate({
 *   username: 'string',
 *   password: 'string',
 * });
 */
export function client<T extends ClientParams>(rawConfig: T): Client<T> {
  const config = validateConfig(rawConfig);
  const http = createHttpClient(config);

  const httpWithAuth =
    'oauth1' in config
      ? createOAuth1HttpClient(http, config)
      : createOAuth2HttpClient(http, config);

  return {
    users: usersService(httpWithAuth),
    data: dataService(httpWithAuth),
    files: filesService(httpWithAuth),
    tasks: tasksService(httpWithAuth),
    template: templateService(httpWithAuth),
    mail: mailService(httpWithAuth),
    configuration: configurationService(httpWithAuth),
    dispatchers: dispatchersService(httpWithAuth),
    auth: {
      ...authService(httpWithAuth),
      authenticate: (oauth: AuthParams): Promise<void> =>
        httpWithAuth.authenticate(parseAuthParams(oauth)),
      confirmMfa: httpWithAuth.confirmMfa,
    } as any,
    rawAxios: httpWithAuth,
  };
}
