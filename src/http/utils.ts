import * as OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';
import { AxiosResponse } from 'axios';
import { camelizeKeys } from 'humps';
import { Config } from '../types';

function hmacSha1Hash(baseString: string, key: string) {
  return crypto.createHmac('sha1', key).update(baseString).digest('base64');
}

export const parseAuthParams = (options: Config['oauth']) => {
  if ('consumerKey' in options && 'email' in options) {
    // oauth1
    return {
      path: '/auth/v2/oauth1/tokens',
      params: {
        email: options.email,
        password: options.password,
      },
      oauth1: new OAuth({
        consumer: {
          key: options.consumerKey,
          secret: options.consumerSecret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function: hmacSha1Hash,
      }),
    };
  }

  if ('username' in options) {
    // oauth2
    return {
      path: '/auth/v2/oauth2/token',
      params: {
        grant_type: 'password',
        client_id: options.clientId,
        username: options.username,
        password: options.password,
      },
    };
  }

  if ('code' in options) {
    // oauth2
    return {
      path: '/auth/v2/oauth2/token',
      params: {
        grant_type: 'authorization_code',
        client_id: options.clientId,
      },
    };
  }
  return {};
};

export const camelizeResponseData = ({
  data,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  data: camelizeKeys(data),
});
