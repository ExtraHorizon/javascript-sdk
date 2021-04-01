export default function rqlBuilder() {
  let returnString = '';

  const api = {
    select(value: string | Array<string>) {
      return processQuery(
        'select',
        typeof value === 'string' ? value : value.join(',')
      );
    },
    limit(limit: number, offset?: number) {
      return processQuery('limit', `${limit}${offset ? `,${offset}` : ''}`);
    },
    sort(value: string | Array<string>) {
      return processQuery(
        'sort',
        typeof value === 'string' ? value : value.join(',')
      );
    },
    out(field: string, list: Array<string>) {
      return processQuery('out', `${field},${list.join(',')}`);
    },
    in(field: string, list: Array<string>) {
      return processQuery('in', `${field},${list.join(',')}`);
    },
    ge(field: string, value: string) {
      return processQuery('ge', `${field},${value}`);
    },
    eq(field: string, value: string) {
      return processQuery('eq', `${field},${value}`);
    },
    le(field: string, value: string) {
      return processQuery('le', `${field},${value}`);
    },
    ne(field: string, value: string) {
      return processQuery('ne', `${field},${value}`);
    },
    like(field: string, value: string) {
      return processQuery('like', `${field},${value}`);
    },
    lt(field: string, value: string) {
      return processQuery('gt', `${field},${value}`);
    },
    gt(field: string, value: string) {
      return processQuery('gt', `${field},${value}`);
    },
    build(): string {
      return returnString;
    },
  };

  function processQuery(operation: string, value: string) {
    returnString = returnString
      .concat(returnString.startsWith('?') ? '&' : '?')
      .concat(`${operation}(${value})`);
    return api;
  }

  return api;
}
