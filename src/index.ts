import { AxiosInstance } from 'axios';
import { ClientParams, AuthParams } from './types';

import {
  usersService,
  authService,
  dataService,
  tasksService,
  filesService,
} from './services';

import {
  createHttpClient,
  createOAuth1HttpClient,
  parseAuthParams,
  createOAuth2HttpClient,
} from './http';
import { validateConfig } from './utils';
import { MfaConfig } from './http/types';

export type {
  ConfigurationType,
  Schema,
  JSONSchema,
  JSONSchemaObject,
  JSONSchemaArray,
  JSONSchemaString,
  JSONSchemaNumber,
  JSONSchemaBoolean,
  DocumentBase,
} from './services/data/types';

export { rqlBuilder } from './rql';
export * from './errors';
export * from './services/users/models/GlobalPermissionName';

export interface Client {
  users: ReturnType<typeof usersService>;
  auth: ReturnType<typeof authService> & {
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
  };
  data: ReturnType<typeof dataService>;
  files: ReturnType<typeof filesService>;
  tasks: ReturnType<typeof tasksService>;
  rawAxios: AxiosInstance;
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
export function client(rawConfig: ClientParams): Client {
  const config = validateConfig(rawConfig);
  const http = createHttpClient(config);

  const httpWithAuth =
    'oauth1' in config
      ? createOAuth1HttpClient(http, config)
      : createOAuth2HttpClient(http, config);

  async function authenticate(oauth: AuthParams) {
    const authConfig = parseAuthParams(oauth);

    await httpWithAuth.authenticate(authConfig);
  }

  return {
    get users() {
      return usersService(httpWithAuth);
    },
    get auth() {
      return {
        ...authService(httpWithAuth),
        authenticate,
        confirmMfa(mfa: MfaConfig) {
          console.log('confirm', !httpWithAuth);
          if (!httpWithAuth) {
            throw new Error(
              'First call authenticate. See README for more info how to use MFA.'
            );
          }
          return httpWithAuth.confirmMfa(mfa);
        },
      };
    },
    get data() {
      return dataService(httpWithAuth);
    },
    get files() {
      return filesService(httpWithAuth);
    },
    get tasks() {
      return tasksService(httpWithAuth);
    },
    get rawAxios() {
      if (!httpWithAuth) {
        throw new Error(
          'First call authenticate. See README for more info how to use rawAxios.'
        );
      }
      return httpWithAuth;
    },
  };
}
