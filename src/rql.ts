// TypeScript Does not allow custom error on type errors. This is a hackish work around.
type NotAnRQLStringError =
  'Please use rqlBuilder to construct valid RQL. See README for an example.';
type RQLCheck<T> = T extends any ? NotAnRQLStringError : T;

export type RQLString = RQLCheck<string>;

export interface RQLBuilder {
  /**
   * Trims each object down to the set of properties defined in the arguments
   * - Only return field1 and field2 from the records: select(field1, field2)
   */
  select: (value: string | string[]) => RQLBuilder;

  /**
   * - Only return 1 record: limit(1)
   * - Only return 10 records and skip the first 50: limit(10, 50)
   */
  limit: (limit: number, offset?: number) => RQLBuilder;

  /**
   * Sorts by the given property in order specified by the prefix
   * - \+ for ascending
   * - \- for descending
   */
  sort: (value: string | string[]) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is not in the provided array
   */
  out: (field: string, list: string[]) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is in the provided array
   */
  in: (field: string, list: string[]) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is greater than or equal to the provided value
   */
  ge: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is equal to the provided value
   */
  eq: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is less than or equal to the provided value
   */
  le: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is not equal to the provided value
   */
  ne: (field: string, value: string) => RQLBuilder;

  /**
   * Only return records that don't have field1: contains(field1)
   */
  like: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is less than the provided value
   */
  lt: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is greater than the provided value
   */
  gt: (field: string, value: string) => RQLBuilder;

  /**
   * Allows combining results of 2 or more queries with the logical AND operator.
   */
  and: (...list: RQLString[]) => RQLBuilder;

  /**
   * Allows combining results of 2 or more queries with the logical OR operator.
   */
  or: (...list: RQLString[]) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is an array and the array contains
   * any value that equals the provided value or satisfies the provided expression.
   */
  contains: (field: string, value: string) => RQLBuilder;

  /**
   * Returns a valid rqlString
   * @returns valid rqlString
   */
  build: () => RQLString;

  /**
   * Returns an intermediate rqlString you can combine in or/and statements
   * @returns valid rqlString
   */
  intermediate: () => RQLString;
}

/**
 * RQL is a Resource Query Language designed for use in URIs with object data structures. RQL can be thought as basically a set of nestable named operators which each have a set of arguments written in a query string.
 * @see https://developers.extrahorizon.io/guide/rql.html
 * @returns
 */
export function rqlBuilder(rql?: RQLString): RQLBuilder {
  let returnString = rql || '';

  const builder: RQLBuilder = {
    select(value) {
      return processQuery(
        'select',
        typeof value === 'string' ? value : value.join(',')
      );
    },
    limit(limit, offset?) {
      return processQuery('limit', `${limit}${offset ? `,${offset}` : ''}`);
    },
    sort(value) {
      return processQuery(
        'sort',
        typeof value === 'string' ? value : value.join(',')
      );
    },
    out(field, list) {
      return processQuery('out', `${field},${list.join(',')}`);
    },
    in(field, list) {
      return processQuery('in', `${field},${list.join(',')}`);
    },
    or(...list) {
      return processQuery('or', `${list.join(',')}`);
    },
    and(...list) {
      return processQuery('and', `${list.join(',')}`);
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
      return processQuery('gt', `${field},${value}`);
    },
    gt(field, value) {
      return processQuery('gt', `${field},${value}`);
    },
    contains(field, value) {
      return processQuery('contains', `${field},${value}`);
    },
    build(): RQLString {
      return `${
        returnString.length > 0 ? '?' : ''
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
