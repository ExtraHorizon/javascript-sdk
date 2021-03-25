import { Config } from './types';

import usersFn from './endpoints/users';
import { parseAuthParams } from './http/utils';
import { createHttpClient, addAuth1, addAuth2 } from './http';

export function client(config: Config) {
  const http = createHttpClient(config);
  const authConfig = parseAuthParams(config.oauth);

  const httpWithAuth = (authConfig.oauth1 ? addAuth1 : addAuth2)(
    http,
    config,
    authConfig
  );

  return { users: usersFn(http, httpWithAuth) };
}
