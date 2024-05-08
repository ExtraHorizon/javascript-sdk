import rqlParserFromLibrary from './parser';
import {
  RQLBuilder,
  RqlBuilderFactory,
  RQLBuilderInput,
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
  const { doubleEncodeValues, rql: inputString } = determineInput(input);

  let operations = [];

  if (inputString) {
    const normalizedInputString = inputString.charAt(0) === '?' ? inputString.substr(1) : inputString;
    rqlParser(normalizedInputString);

    operations.push(normalizedInputString);
  }

  const builder: RQLBuilder = {
    select(fields) {
      return processQuery(
        'select',
        typeof fields === 'string' ? fields : fields.join(',')
      );
    },
    limit(limit, offset) {
      operations = operations
        .filter(operation => !operation.match(/^limit\(\d*,*\d*\)$/)) // Remove any standalone limit operations
        .map(operation => operation.replace(/&?limit\(\d*,*\d*\)&*/, '')); // Remove any limit operations in existing queries (broken, consumes both surrounding `&`, ticket #910)

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
    or(...expressions) {
      return processQuery('or', `${expressions.join(',')}`);
    },
    and(...expressions) {
      return processQuery('and', `${expressions.join(',')}`);
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
        conditions.length > 0 ?
          `${field},${rqlBuilder()
            .and(...conditions)
            .intermediate()}` :
          field
      );
    },
    excludes(field, ...conditions) {
      return processQuery(
        'excludes',
        conditions.length > 0 ?
          `${field},${rqlBuilder()
            .and(...conditions)
            .intermediate()}` :
          field
      );
    },
    skipCount() {
      return processQuery('skipCount', '');
    },
    build(): RQLString {
      return `?${operations.join('&')}` as unknown as RQLString;
    },
    intermediate(): RQLString {
      if (operations.length > 1) {
        return `and(${operations.join(',')})` as unknown as RQLString;
      }

      return operations[0] || '';
    },
  };

  function processValue(value: string) {
    if (!doubleEncodeValues) {
      return value;
    }

    const singleEncodedValue = encodeValue(value);
    const doubleEncodedValue = encodeValue(singleEncodedValue);

    return doubleEncodedValue;
  }

  function encodeValue(value: string) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_rfc3986
    return encodeURIComponent(value).replace(
      /[-_.!~*'()]/g,
      c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
  }

  function processQuery(operation: string, value: string) {
    operations.push(`${operation}(${value})`);
    return builder;
  }

  return builder;
};

// Resolve the input for a rql builder
function determineInput(input: RQLBuilderInput) {
  const result = {
    doubleEncodeValues: rqlBuilder.doubleEncodeValues,
    rql: '',
  };

  if (!input) {
    return result;
  }

  // If the input is RQLBuilderOptions override the result
  if (typeof input === 'object') {
    const { doubleEncodeValues, rql } = input;
    result.doubleEncodeValues = doubleEncodeValues ?? result.doubleEncodeValues;
    result.rql = rql ?? result.rql;

    return result;
  }

  // If the input is an RQLBuilderString override the rql property
  result.rql = input;

  return result;
}

rqlBuilder.doubleEncodeValues = true;
