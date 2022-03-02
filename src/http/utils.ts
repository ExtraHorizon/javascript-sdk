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
      skipTokenCheck: options.skipTokenCheck || false,
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
        code: options.code,
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

export function mapObjIndexed(
  fn: any,
  object: Record<string, any>
): Record<string, unknown> {
  return Object.keys(object).reduce(
    (memo, key) => ({ ...memo, [key]: fn(object[key], key) }),
    {}
  );
}

export const recursiveMap =
  (fn: any, skipData = false) =>
  <T>(obj: T): T => {
    // needed for arrays with strings/numbers etc
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    return Array.isArray(obj)
      ? (obj.map<T>(recursiveMap(fn, skipData)) as unknown as T)
      : (mapObjIndexed((value: T, key: string) => {
          if (typeof value !== 'object') {
            return fn(value, key);
          }

          // if recursively mapping and we find a data property that
          // is an object, return the object.
          if (skipData && key === 'data' && !Array.isArray(value)) {
            return value;
          }
          return recursiveMap(fn, skipData)(value);
        }, obj) as T);
  };

/**
 * See if an object (`val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 */
function is(Ctor: any, value: any) {
  return (value != null && value.constructor === Ctor) || value instanceof Ctor;
}

export function recursiveRenameKeys(
  fn: { (arg: string): string },
  obj: any
): any {
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
  // If all characters are uppercase, no need to decamelize as this is very likely a language code
  return string.toUpperCase() === string
    ? string
    : string
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

/**
 * Composes a `User-Agent` like header value which looks something like
 * `'Node/14.4.0 SDK/3.0.0'`.
 */
export function composeUserAgent(packageVersion: string): string {
  return [
    typeof process !== 'undefined' && process?.release?.name === 'node'
      ? `Node/${process.version} OS/${process.platform}-${process.arch}`
      : '',
    `SDK/${packageVersion}`,
  ].join(' ');
}
