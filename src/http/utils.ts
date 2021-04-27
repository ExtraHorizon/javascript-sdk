import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { AxiosResponse } from 'axios';
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

export const mapObjIndexed = (fn, object): Record<string, unknown> =>
  Object.keys(object).reduce(
    (memo, key) => ({ ...memo, [key]: fn(object[key], key) }),
    {}
  );

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
    [
      'creationTimestamp',
      'expiryTimestamp',
      'updateTimestamp',
      'lastFailedTimestamp',
    ].includes(key)
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

/**
 * See if an object (`val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 */
function is(Ctor, value) {
  return (value != null && value.constructor === Ctor) || value instanceof Ctor;
}

export function recursiveRenameKeys(fn: { (arg: string): string }, obj) {
  if (Array.isArray(obj)) {
    return obj.map(value => recursiveRenameKeys(fn, value));
  }

  if (is(Object, obj)) {
    return Object.keys(obj).reduce((memo, key) => {
      if (is(Object, obj[key]) && !is(Date, obj[key])) {
        return { ...memo, [fn(key)]: recursiveRenameKeys(fn, obj[key]) };
      }
      return { ...memo, [fn(key)]: obj[key] };
    }, {});
  }
  return obj;
}

const keyFunction = key => {
  if (['records_affected', 'recordsAffected'].includes(key)) {
    return 'affectedRecords';
  }
  return key;
};

export const transformKeysResponseData = ({
  data,
  config,
  ...response
}: AxiosResponse): AxiosResponse => ({
  ...response,
  config,
  data: ['arraybuffer', 'stream'].includes(config.responseType)
    ? data
    : recursiveRenameKeys(keyFunction, data),
});

export function camelize(string: string): string {
  return string
    .split(/_/)
    .map((word, index) =>
      index > 0 ? word.substr(0, 1).toUpperCase() + word.substr(1) : word
    )
    .join('');
}

export function decamelize(string: string): string {
  return string
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
}

export function camelizeKeys(
  object: Record<string, unknown>
): Record<string, unknown> {
  return recursiveRenameKeys(camelize, object);
}

export function decamelizeKeys(
  object: Record<string, unknown>
): Record<string, unknown> {
  return recursiveRenameKeys(decamelize, object);
}
