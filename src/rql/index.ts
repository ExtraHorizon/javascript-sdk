import rqlParserFromLibrary from './parser';
import {
  RQLBuilder,
  RqlBuilderFactory,
  RQLBuilderInput,
  RQLBuilderString,
  RQLString,
} from './types';

export * from './types';

/**
 * rqlParser accepts a regular string and returns a valid RQLString if it's valid.
 * @see https://developers.extrahorizon.io/guide/rql.html
 * @returns {RQLString}
 * @throws {URIError}
 * @throws {Error}
 */
export function rqlParser(rql: string): RQLString {
  rqlParserFromLibrary(rql);
  return rql as RQLString;
}

/**
 * RQL is a Resource Query Language designed for use in URIs with object data structures. RQL can be thought as basically a set of nestable named operators which each have a set of arguments written in a query string.
 * @see https://developers.extrahorizon.io/guide/rql.html
 * @returns
 */
export const rqlBuilder: RqlBuilderFactory = (
  input: RQLBuilderInput
): RQLBuilder => {
  let returnString = '';
  let shouldDoubleEncode = rqlBuilder.doubleEncodeValues;

  let rqlString: RQLBuilderString;
  if (typeof input === 'object') {
    // If an argument for double encode is provided it takes precedent over the global setting
    const { doubleEncode, rql } = input;
    shouldDoubleEncode = doubleEncode ?? rqlBuilder.doubleEncodeValues;
    rqlString = rql;
  } else {
    rqlString = input;
  }

  returnString =
    rqlString && rqlString.charAt(0) === '?'
      ? rqlString.substr(1)
      : rqlString || '';
  rqlParser(returnString);

  const builder: RQLBuilder = {
    select(fields) {
      return processQuery(
        'select',
        typeof fields === 'string' ? fields : fields.join(',')
      );
    },
    limit(limit, offset) {
      if (returnString.includes('limit(')) {
        returnString = returnString.replace(/&?limit\(\d*,*\d*\)&*/, '');
      }
      return processQuery('limit', `${limit}${offset ? `,${offset}` : ''}`);
    },
    sort(fields) {
      return processQuery(
        'sort',
        typeof fields === 'string' ? fields : fields.join(',')
      );
    },
    out(field, values) {
      const encodedValues = values.map(value => processValue(value));
      return processQuery('out', `${field},${encodedValues.join(',')}`);
    },
    in(field, values) {
      const encodedValues = values.map(value => processValue(value));
      return processQuery('in', `${field},${encodedValues.join(',')}`);
    },
    or(...conditions) {
      return processQuery('or', `${conditions.join(',')}`);
    },
    and(...conditions) {
      return processQuery('and', `${conditions.join(',')}`);
    },
    ge(field, value) {
      return processQuery('ge', `${field},${processValue(value)}`);
    },
    eq(field, value) {
      return processQuery('eq', `${field},${processValue(value)}`);
    },
    le(field, value) {
      return processQuery('le', `${field},${processValue(value)}`);
    },
    ne(field, value) {
      return processQuery('ne', `${field},${processValue(value)}`);
    },
    like(field, value) {
      return processQuery('like', `${field},${processValue(value)}`);
    },
    lt(field, value) {
      return processQuery('lt', `${field},${processValue(value)}`);
    },
    gt(field, value) {
      return processQuery('gt', `${field},${processValue(value)}`);
    },
    contains(field, ...conditions) {
      return processQuery(
        'contains',
        conditions.length > 0
          ? `${field},${rqlBuilder()
              .and(...conditions)
              .intermediate()}`
          : field
      );
    },
    excludes(field, ...conditions) {
      return processQuery(
        'excludes',
        conditions.length > 0
          ? `${field},${rqlBuilder()
              .and(...conditions)
              .intermediate()}`
          : field
      );
    },
    skipCount() {
      return processQuery('skipCount', '');
    },
    build(): RQLString {
      return `${
        returnString.length > 0 && returnString.charAt(0) !== '?' ? '?' : ''
      }${returnString}` as RQLString;
    },
    intermediate(): RQLString {
      return returnString as RQLString;
    },
  };

  function processValue(value: string) {
    if (!shouldDoubleEncode) {
      return value;
    }

    const singleEncodedValue = encodeValue(value);
    const doubleEncodedValue = encodeValue(singleEncodedValue);

    return doubleEncodedValue;
  }

  function encodeValue(value: string) {
    return encodeURIComponent(value).replace(
      /[-_.!~*'()]/g,
      c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
  }

  function processQuery(operation: string, value: string) {
    returnString = returnString
      .concat(returnString.length > 0 ? '&' : '')
      .concat(`${operation}(${value})`);
    return builder;
  }

  return builder;
};

rqlBuilder.doubleEncodeValues = true;
