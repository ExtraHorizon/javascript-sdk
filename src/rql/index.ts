import rqlParserFromLibrary from './parser';
import { RQLBuilder, RQLString } from './types';

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
export function rqlBuilder(rql?: RQLString | string): RQLBuilder {
  let returnString = rql && rql.charAt(0) === '?' ? rql.substr(1) : rql || '';
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
      return processQuery('out', `${field},${values.join(',')}`);
    },
    in(field, values) {
      return processQuery('in', `${field},${values.join(',')}`);
    },
    or(...conditions) {
      return processQuery('or', `${conditions.join(',')}`);
    },
    and(...conditions) {
      return processQuery('and', `${conditions.join(',')}`);
    },
    ge(field, value) {
      return processQuery('ge', `${field},${value}`);
    },
    eq(field, value) {
      return processQuery('eq', `${field},${value}`);
    },
    le(field, value) {
      return processQuery('le', `${field},${value}`);
    },
    ne(field, value) {
      return processQuery('ne', `${field},${value}`);
    },
    like(field, value) {
      return processQuery('like', `${field},${value}`);
    },
    lt(field, value) {
      return processQuery('lt', `${field},${value}`);
    },
    gt(field, value) {
      return processQuery('gt', `${field},${value}`);
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

  function processQuery(operation: string, value: string) {
    if (value.includes(' ')) {
      console.log(
        'A space has been detected while building the rql, please be aware that problems can arise'
      );
    }
    returnString = returnString
      .concat(returnString.length > 0 ? '&' : '')
      .concat(`${operation}(${value})`);
    return builder;
  }

  return builder;
}
