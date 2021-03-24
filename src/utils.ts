import * as _ from 'lodash';

const isArray = a => Array.isArray(a);

const isObject = o => o === Object(o) && !isArray(o) && typeof o !== 'function';

export const toCamelCase = o => {
  if (isObject(o)) {
    const n = {};
    Object.keys(o)
      .forEach(k => {
        n[_.camelCase(k)] = toCamelCase(o[k]);
      });
    return n;
  }
  if (isArray(o)) {
    return o.map(i => toCamelCase(i));
  }
  return o;
};
