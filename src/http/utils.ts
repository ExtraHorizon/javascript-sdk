import * as OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';
import { AxiosResponse } from 'axios';
import { mapObjIndexed } from 'ramda';
import { camelizeKeys } from 'humps';
import { OAuthConfig } from '../types';
import { AuthConfig } from './types';
import { AUTH_BASE } from '../constants';

function hmacSha1Hash(baseString: string, key: string) {
  return crypto.createHmac('sha1', key).update(baseString).digest('base64');
}

export const parseAuthParams = (options: OAuthConfig): AuthConfig => {
  if ('consumerKey' in options && 'email' in options) {
    // oauth1
    return {
      path: `${AUTH_BASE}/oauth1/tokens`,
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
      path: `${AUTH_BASE}/oauth2/token`,
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
      path: `${AUTH_BASE}/oauth2/token`,
      params: {
        grant_type: 'authorization_code',
        client_id: options.clientId,
      },
    };
  }

  if ('refreshToken' in options) {
    // oauth2
    return {
      path: `${AUTH_BASE}/oauth2/token`,
      params: {
        grant_type: 'refresh_token',
        refresh_token: options.refreshToken,
      },
    };
  }

  throw new Error('Invalid Oauth config');
};

export const camelizeResponseData = ({
  data,
  config,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  config,
  data: ['arraybuffer', 'stream'].includes(config.responseType)
    ? data
    : camelizeKeys(data),
});

export const recursiveMap = fn => obj =>
  Array.isArray(obj)
    ? obj.map(recursiveMap(fn))
    : mapObjIndexed(
        (value, key) =>
          typeof value !== 'object' ? fn(value, key) : recursiveMap(fn)(value),
        obj
      );

const mapFunction = (value, key) => {
  if (
    ['creationTimestamp', 'expiryTimestamp', 'updateTimestamp'].includes(key)
  ) {
    return new Date(value);
  }
  return value;
};

export const transformResponseData = ({
  data,
  config,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  config,
  data: ['arraybuffer', 'stream'].includes(config.responseType)
    ? data
    : recursiveMap(mapFunction)(data),
});
