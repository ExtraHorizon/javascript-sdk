import { Config, OAuthConfig } from './types';

import usersService from './services/users';
import authService from './services/auth';
import { createHttpClient, addAuth2, parseAuthParams } from './http';

export { default as rqlBuilder } from './rql';

function validateConfig({ apiHost, ...config }: Config): Config {
  return {
    ...config,
    apiHost: apiHost.endsWith('/')
      ? apiHost.substr(0, apiHost.length - 1)
      : apiHost,
  };
}

export interface Client {
  authenticate: (oauth: OAuthConfig) => Promise<void>;
  confirmMfa: (oauth: OAuthConfig) => Promise<void>;
  users: ReturnType<typeof usersService>;
  auth: ReturnType<typeof authService>;
}

/**
 * Create ExtraHorizon client.
 *
 * @example
 * const sdk = client({
 *   apiHost: 'xxx.fibricheck.com',
 *   oauth: {
 *     clientId: 'string',
 *     username: 'string',
 *     password: 'string',
 *   },
 * });
 */
export function client(rawConfig: Config): Client {
  const config = validateConfig(rawConfig);
  const http = createHttpClient(config);

  let httpWithAuth;

  async function authenticate(oauth: OAuthConfig) {
    const authConfig = parseAuthParams(oauth);
    // httpWithAuth = ('oauth1' in authConfig ? addAuth1 : addAuth2)(http, config);
    httpWithAuth = addAuth2(http, config);

    await httpWithAuth.authenticate(authConfig);
  }

  return {
    authenticate,
    get confirmMfa() {
      return httpWithAuth.confirmMfa;
    },
    get users() {
      return usersService(http, httpWithAuth);
    },
    get auth() {
      return authService(http, httpWithAuth);
    },
  };
}
