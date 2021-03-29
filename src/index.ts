import { Config } from './types';

import usersFn from './endpoints/users';
import { parseAuthParams } from './http/utils';
import { createHttpClient, addAuth1, addAuth2 } from './http';

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
  const authConfig = parseAuthParams(config.oauth);

  const httpWithAuth = (authConfig.oauth1 ? addAuth1 : addAuth2)(
    http,
    config,
    authConfig
  );

  return { users: usersFn(http, httpWithAuth) };
}
