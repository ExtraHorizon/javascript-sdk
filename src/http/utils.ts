export function mapObjIndexed(fn, object): Record<string, unknown> {
  return Object.keys(object).reduce(
    (memo, key) => ({ ...memo, [key]: fn(object[key], key) }),
    {}
  );
}

export const recursiveMap =
  (fn, skipData = false) =>
  obj => {
    // needed for arrays with strings/numbers etc
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    return Array.isArray(obj)
      ? obj.map(recursiveMap(fn, skipData))
      : mapObjIndexed((value, key) => {
          if (typeof value !== 'object') {
            return fn(value, key);
          }

          // if recursively mapping and we find a data property that
          // is an object, return the object.
          if (skipData && key === 'data' && !Array.isArray(value)) {
            return value;
          }
          return recursiveMap(fn, skipData)(value);
        }, obj);
  };

/**
 * See if an object (`val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 */
function is(Ctor, value) {
  return (value != null && value.constructor === Ctor) || value instanceof Ctor;
}

export function recursiveRenameKeys(
  fn: { (arg: string): string },
  obj,
  skipKeys: string[]
) {
  // If skipKeys includes the '*', we don't need to convert anything in this object
  if (skipKeys.includes('*')) return obj;

  // If the object is an array, recursively apply the function to each element in the array.
  if (Array.isArray(obj)) {
    return obj.map(value => recursiveRenameKeys(fn, value, skipKeys));
  }

  if (is(Object, obj)) {
    return Object.keys(obj).reduce((memo, key) => {
      // Check that `obj[key]` is an object
      // If it is date or `skipKeys` includes the current key, don't continue the recursion
      if (
        is(Object, obj[key]) &&
        !is(Date, obj[key]) &&
        !skipKeys.includes(key)
      ) {
        // Filter all keys in `skipKeys` that start with the current `key` before the first `.`
        // Remove the current `key` from those keys before going into the next iteration.
        const keys = skipKeys
          .filter(k => k.split('.')[0] === key)
          .map(k => k.split('.').slice(1).join('.'));

        return { ...memo, [fn(key)]: recursiveRenameKeys(fn, obj[key], keys) };
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
  object: Record<string, unknown>,
  keysToSkip: string[]
): Record<string, unknown> {
  return recursiveRenameKeys(camelize, object, keysToSkip);
}

export function decamelizeKeys(
  object: Record<string, unknown>,
  keysToSkip: string[]
): Record<string, unknown> {
  return recursiveRenameKeys(decamelize, object, keysToSkip);
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
