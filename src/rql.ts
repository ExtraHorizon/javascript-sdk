export default function rqlBuilder() {
  let returnString = '';

  const api = {
    select(value) {
      return concatValue('select', value);
    },
    limit(limit: number, offset?: number) {
      return concatValue('limit', `${limit}${offset ? `,${offset}` : ''}`);
    },
    sort(fields: Array<string>) {
      return concatValue('sort', fields);
    },
    out(field: string, list: Array<string>) {
      return concatValue('out', `${field},${list.join(',')}`);
    },
    in(field: string, list: Array<string>) {
      return concatValue('in', `${field},${list.join(',')}`);
    },
    ge(field: string, value: string) {
      return concatValue('ge', `${field},${value}`);
    },
    eq(field: string, value: string) {
      return concatValue('eq', `${field},${value}`);
    },
    le(field: string, value: string) {
      return concatValue('le', `${field},${value}`);
    },
    ne(field: string, value: string) {
      return concatValue('ne', `${field},${value}`);
    },
    like(field: string, value: string) {
      return concatValue('like', `${field},${value}`);
    },
    lt(field: string, value: string) {
      return concatValue('gt', `${field},${value}`);
    },
    gt(field: string, value: string) {
      return concatValue('gt', `${field},${value}`);
    },
    toString() {
      return returnString;
    },
  };

  function concatValue(operation, value) {
    returnString = returnString
      .concat(returnString.startsWith('?') ? '&' : '?')
      .concat(`${operation}(${value})`);
    return api;
  }

  return api;
}
