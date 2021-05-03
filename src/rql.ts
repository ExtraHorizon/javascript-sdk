// TypeScript Does not allow custom error on type errors. This is a hackish work around.
type NotAnRQLStringError = 'Please use rqlBuilder to construct valid RQL. See README for an example.';
type RQLCheck<T> = T extends any ? NotAnRQLStringError : T;

export type RQLString = RQLCheck<string>;

export interface RQLBuilder {
  select: (value: string | string[]) => RQLBuilder;
  limit: (limit: number, offset?: number) => RQLBuilder;
  sort: (value: string | string[]) => RQLBuilder;
  out: (field: string, list: string[]) => RQLBuilder;
  in: (field: string, list: string[]) => RQLBuilder;
  ge: (field: string, value: string) => RQLBuilder;
  eq: (field: string, value: string) => RQLBuilder;
  le: (field: string, value: string) => RQLBuilder;
  ne: (field: string, value: string) => RQLBuilder;
  like: (field: string, value: string) => RQLBuilder;
  lt: (field: string, value: string) => RQLBuilder;
  gt: (field: string, value: string) => RQLBuilder;
  build: () => RQLString;
}

export function rqlBuilder(): RQLBuilder {
  let returnString = '';

  const api: RQLBuilder = {
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
    build(): RQLString {
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
      .concat(returnString.startsWith('?') ? '&' : '?')
      .concat(`${operation}(${value})`);
    return api;
  }

  return api;
}
