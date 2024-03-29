export function mapObjIndexed(fn, object): Record<string, unknown> {
  return Object.keys(object).reduce(
    (memo, key) => ({ ...memo, [key]: fn(object[key], key) }),
    {}
  );
}

// WARNING: skipData is old behaviour that we can not remove yet for backwards compatibility
// Removing it would affect raw calls to the data-service
export const recursiveMap = (fn, obj, ignoreKeys = [], skipData = false) => {
  // needed for arrays with strings/numbers etc
  if (obj === null || typeof obj !== 'object' || ignoreKeys.includes('*')) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(value => recursiveMap(fn, value, ignoreKeys, skipData));
  }

  return mapObjIndexed((value, key) => {
    if (typeof value !== 'object' || ignoreKeys.includes(key)) {
      return fn(value, key);
    }

    // WARNING: this is old stuff that we could not remove yet for backwards compatibility
    // if recursively mapping and we find a data property that
    // is an object, return the object.
    if (skipData && key === 'data' && !Array.isArray(value)) {
      return value;
    }

    // Filter all keys in `ignoreKeys` that start with the current `key` before the first `.`
    // Remove the current `key` from those keys before going into the next iteration.
    const partialIgnoreKeys = ignoreKeys
      .filter(k => k.startsWith(`${key}.`))
      .map(k => k.split('.').slice(1).join('.'));

    return recursiveMap(fn, value, partialIgnoreKeys, skipData);
  }, obj);
};

/**
 * See if an object (`val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 */
function is(Ctor, value) {
  return (value != null && value.constructor === Ctor) || value instanceof Ctor;
}
/**
 * Recursively renames keys in an object using a provided function.
 * @param fn A function that takes a string (key) and returns a string (new key).
 * @param obj The object to rename they keys in.
 * @param ignoreKeys An array of keys to ignore during the renaming process.
 * @returns An object with keys renamed according to the provided function.
 */
export function recursiveRenameKeys(
  fn: { (arg: string): string; },
  obj,
  ignoreKeys: string[] = []
) {
  // If ignoreKeys includes the '*', we don't need to convert anything in this object
  if (ignoreKeys.includes('*')) { return obj; }

  // If the object is an array, recursively apply the function to each element in the array.
  if (Array.isArray(obj)) {
    return obj.map(value => recursiveRenameKeys(fn, value, ignoreKeys));
  }

  if (is(Object, obj)) {
    return Object.keys(obj).reduce((memo, key) => {
      // Check that `obj[key]` is an object
      // If it is date or `ignoreKeys` includes the current key, don't continue the recursion
      if (
        is(Object, obj[key]) &&
        !is(Date, obj[key]) &&
        !ignoreKeys.includes(key)
      ) {
        // Filter all keys in `ignoreKeys` that start with the current `key` before the first `.`
        // Remove the current `key` from those keys before going into the next iteration.
        const partialIgnoreKeys = ignoreKeys
          .filter(k => k.startsWith(`${key}.`))
          .map(k => k.split('.').slice(1).join('.'));

        return {
          ...memo,
          [fn(key)]: recursiveRenameKeys(fn, obj[key], partialIgnoreKeys),
        };
      }
      return { ...memo, [fn(key)]: obj[key] };
    }, {});
  }
  return obj;
}

export function camelize(string: string): string {
  return string
    .split(/_/)
    .map((word, index) => (index > 0 ? word.substr(0, 1).toUpperCase() + word.substr(1) : word))
    .join('');
}

export function decamelize(string: string): string {
  // If all characters are uppercase, no need to decamelize as this is very likely a language code
  return string.toUpperCase() === string ?
    string :
    string
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
}

export function camelizeKeys(
  object: Record<string, unknown>,
  ignoreKeys?: string[]
): Record<string, unknown> {
  return recursiveRenameKeys(camelize, object, ignoreKeys);
}

export function decamelizeKeys(
  object: Record<string, unknown>,
  ignoreKeys?: string[]
): Record<string, unknown> {
  return recursiveRenameKeys(decamelize, object, ignoreKeys);
}

/**
 * Composes a `User-Agent` like header value which looks something like
 * `'Node/14.4.0 SDK/3.0.0'`.
 */
export function composeUserAgent(packageVersion: string): string {
  return [
    typeof process !== 'undefined' && process?.release?.name === 'node' ?
      `Node/${process.version} OS/${process.platform}-${process.arch}` :
      '',
    `SDK/${packageVersion}`,
  ].join(' ');
}
