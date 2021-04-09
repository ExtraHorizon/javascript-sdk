import { Config, OAuthConfig } from './types';

import usersService from './services/users';
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

export function client(rawConfig: Config) {
  const config = validateConfig(rawConfig);
  const http = createHttpClient(config);

  let httpWithAuth;

  async function authenticate(oauth: OAuthConfig) {
    const authConfig = parseAuthParams(oauth);
    // httpWithAuth = ('oauth1' in authConfig ? addAuth1 : addAuth2)(http, config);
    httpWithAuth = addAuth2(http, config);

    return await httpWithAuth.authenticate(authConfig);
  }

  return {
    authenticate,
    get confirmMfa() {
      return httpWithAuth.confirmMfa;
    },
    get users() {
      return usersService(http, httpWithAuth);
    },
  };
}
