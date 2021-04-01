import { decamelizeKeys } from 'humps';
import { Config } from './types';

import prepareHttpClient from './services/http-client';
import getUsersService from './services/users';
import { createHttpClient, addAuth1, addAuth2, parseAuthParams } from './http';

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
  const authConfig: any = parseAuthParams(config.oauth);

  const httpWithAuth = (authConfig.oauth1 ? addAuth1 : addAuth2)(
    http,
    config,
    authConfig
  );

  const httpClient = prepareHttpClient(http, httpWithAuth);
  const usersService = getUsersService(httpClient({
    basePath: '/v1/users',
    transformRequestDataFn: decamelizeKeys
  }));

  return {
    users: usersService
  };

}
