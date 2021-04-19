import { Config } from './types';

import usersService from './services/users';
import authService from './services/auth';
import filesService from './services/files';
import { createHttpClient, addAuth1, addAuth2, parseAuthParams } from './http';

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
  users: ReturnType<typeof usersService>;
  auth: ReturnType<typeof authService>;
  files: ReturnType<typeof filesService>;
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
  const authConfig: any = parseAuthParams(config.oauth);

  const httpWithAuth = (authConfig.oauth1 ? addAuth1 : addAuth2)(
    http,
    config,
    authConfig
  );

  return {
    users: usersService(http, httpWithAuth),
    auth: authService(http, httpWithAuth),
    files: filesService(httpWithAuth),
  };
}
