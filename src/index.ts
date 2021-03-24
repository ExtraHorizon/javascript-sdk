import { createHttpClient, addAuth } from './http-client';
import { Config } from './types';

import usersFn from './endpoints/users';

export function client(config: Config) {
  const http = createHttpClient(config);
  const httpWithAuth = addAuth(http, config);

  return { users: usersFn(http, httpWithAuth) };
}
