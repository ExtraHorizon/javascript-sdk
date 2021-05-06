import { AxiosInstance } from 'axios';
import { Config, MfaConfig, AuthParams } from './types';

import {
  usersService,
  authService,
  dataService,
  tasksService,
  filesService,
  mailService,
} from './services';

import {
  createHttpClient,
  createOAuth1HttpClient,
  parseAuthParams,
  createOAuth2HttpClient,
} from './http';

export { rqlBuilder } from './rql';
export * from './services/users/models/GlobalPermissionName';

function validateConfig({ apiHost, ...config }: Config): Config {
  const validApiHostEnd = apiHost.endsWith('/')
    ? apiHost.substr(0, apiHost.length - 1)
    : apiHost;

  return {
    ...config,
    apiHost: validApiHostEnd.startsWith('https://')
      ? validApiHostEnd
      : `https://${validApiHostEnd}`,
  };
}

export interface Client {
  users: ReturnType<typeof usersService>;
  auth: ReturnType<typeof authService> & {
    /**
     * Use OAuth1 Token authentication
     * @example
     * await sdk.auth.authenticate({
     *  consumerKey: '',
     *  consumerSecret: '',
     *  token: '',
     *  tokenSecret: '',
     * });
     */
    authenticate(oauth: {
      consumerKey: string;
      consumerSecret: string;
      token: string;
      tokenSecret: string;
    }): Promise<void>;
    /**
     * Use OAuth1 Password authentication
     * @example
     * await sdk.auth.authenticate({
     *  consumerKey: '',
     *  consumerSecret: '',
     *  email: '',
     *  password: '',
     * });
     */
    authenticate(oauth: {
      consumerKey: string;
      consumerSecret: string;
      email: string;
      password: string;
    }): Promise<void>;
    /**
     * Use OAuth2 Authorization Code Grant flow with callback
     * @example
     * await sdk.auth.authenticate({
     *  clientId: '',
     *  code: '',
     *  redirectUri: '',
     * });
     */
    authenticate(oauth: {
      clientId: string;
      code: string;
      redirectUri: string;
    }): Promise<void>;
    /**
     * Use OAuth2 Password Grant flow
     * @example
     * await sdk.auth.authenticate({
     *  clientId: '',
     *  password: '',
     *  username: '',
     * });
     */
    authenticate(oauth: {
      clientId: string;
      username: string;
      password: string;
    }): Promise<void>;
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
     *      clientId: '',
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
  mail: ReturnType<typeof mailService>;
  rawAxios: AxiosInstance;
}

/**
 * Create ExtraHorizon client.
 *
 * @example
 * const sdk = client({
 *   apiHost: 'xxx.fibricheck.com',
 * });
 * await sdk.auth.authenticate({
 *   clientId: 'string',
 *   username: 'string',
 *   password: 'string',
 * });
 */
export function client(rawConfig: Config): Client {
  const config = validateConfig(rawConfig);
  const http = createHttpClient(config);

  let httpWithAuth;

  async function authenticate(oauth: AuthParams) {
    const authConfig = parseAuthParams(oauth);
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
      return dataService(http, httpWithAuth || http);
    },
    get files() {
      return filesService(httpWithAuth || http);
    },
    get tasks() {
      return tasksService(httpWithAuth || http);
    },
    get mail() {
      return mailService(httpWithAuth || http);
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
