import { Config, MfaConfig, OAuthConfig } from './types';

import usersService from './services/users';
import authService from './services/auth';
import dataService from './services/data';
import filesService from './services/files';
import tasksService from './services/tasks';

import {
  createHttpClient,
  createOAuth1HttpClient,
  parseAuthParams,
  createOAuth2HttpClient,
} from './http';

export { rqlBuilder } from './rql';

function validateConfig({ apiHost, ...config }: Config): Config {
  return {
    ...config,
    apiHost: apiHost.endsWith('/')
      ? apiHost.substr(0, apiHost.length - 1)
      : apiHost,
  };
}

export interface Client {
  users: ReturnType<typeof usersService>;
  auth: ReturnType<typeof authService> & {
    /**
     *  Authentication method to exchange credentials for tokens
     */
    authenticate: (oauth: OAuthConfig) => Promise<void>;
    /**
     *  Confirm MFA method with code
     */
    confirmMfa: (oauth: MfaConfig) => Promise<void>;
  };
  data: ReturnType<typeof dataService>;
  files: ReturnType<typeof filesService>;
  tasks: ReturnType<typeof tasksService>;
}

/**
 * Create ExtraHorizon client.
 *
 * @example
 * const sdk = client({
 *   apiHost: 'xxx.fibricheck.com',
 * });
 * await sdk.auth.authenticate(
 *   clientId: 'string',
 *   username: 'string',
 *   password: 'string',
 * });
 */
export function client(rawConfig: Config): Client {
  const config = validateConfig(rawConfig);
  const http = createHttpClient(config);

  let httpWithAuth;

  async function authenticate(oauth: OAuthConfig) {
    const authConfig: any = parseAuthParams(oauth);
    httpWithAuth = await ('oauth1' in authConfig
      ? createOAuth1HttpClient
      : createOAuth2HttpClient)(http, config);

    await httpWithAuth.authenticate(authConfig);
  }

  return {
    get users() {
      return usersService(http, httpWithAuth || http);
    },
    get auth() {
      return {
        ...authService(http, httpWithAuth || http),
        authenticate,
        confirmMfa() {
          if (!httpWithAuth) {
            throw new Error(
              'First call authenticate. See README for more info how to use MFA.'
            );
          }
          return httpWithAuth.confirmMfa;
        },
      };
    },
    get data() {
      return dataService(http, httpWithAuth);
    },
    get files() {
      return filesService(httpWithAuth || http);
    },
    get tasks() {
      return tasksService(httpWithAuth || http);
    },
  };
}
