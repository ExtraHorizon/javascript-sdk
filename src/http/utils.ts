import { AuthParams } from '../types';
import { AuthConfig } from './types';

export function parseAuthParams(options: AuthParams): AuthConfig {
  if ('email' in options) {
    // oauth1
    return {
      params: {
        email: options.email,
        password: options.password,
      },
    };
  }

  if ('tokenSecret' in options) {
    // oauth1
    return {
      tokenData: {
        key: options.token,
        secret: options.tokenSecret,
      },
    };
  }

  if ('username' in options) {
    // oauth2
    return {
      params: {
        grant_type: 'password',
        username: options.username,
        password: options.password,
      },
    };
  }

  if ('code' in options) {
    // oauth2
    return {
      params: {
        grant_type: 'authorization_code',
      },
    };
  }

  if ('refreshToken' in options) {
    // oauth2
    return {
      params: {
        grant_type: 'refresh_token',
        refresh_token: options.refreshToken,
      },
    };
  }

  throw new Error('Invalid Oauth config');
}

export function mapObjIndexed(fn, object): Record<string, unknown> {
  return Object.keys(object).reduce(
    (memo, key) => ({ ...memo, [key]: fn(object[key], key) }),
    {}
  );
}

export const recursiveMap = fn => obj => {
  // needed for arrays with strings/numbers etc
  if (typeof obj !== 'object') {
    return obj;
  }
  return Array.isArray(obj)
    ? obj.map(recursiveMap(fn))
    : mapObjIndexed(
        (value, key) =>
          typeof value !== 'object' ? fn(value, key) : recursiveMap(fn)(value),
        obj
      );
};

/**
 * See if an object (`val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 */
function is(Ctor, value) {
  return (value != null && value.constructor === Ctor) || value instanceof Ctor;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
