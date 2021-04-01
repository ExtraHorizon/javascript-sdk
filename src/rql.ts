export default function rqlBuilder() {
  let returnString = '';

  const concatValue = function concatValue(operation, value) {
    returnString = returnString
      .concat(returnString.startsWith('?') ? '&' : '?')
      .concat(`${operation}(${value})`);
  };

  const api = {
    select: function select(value) {
      concatValue('select', value);
      return api;
    },
    limit(limit: number, offset?: number) {
      concatValue('limit', `${limit}${offset ? `,${offset}` : ''}`);
      return api;
    },
    sort(fields: Array<string>) {
      concatValue('sort', fields);
      return api;
    },
    ...['in', 'out'].reduce(
      (memo, operator) => ({
        ...memo,
        [operator](field: string, list: Array<string>) {
          concatValue('in', `${field},${list.join(',')}`);
          return api;
        },
      }),
      {}
    ),
    ...['ge', 'eq', 'gt', 'lt', 'le', 'ne', 'like'].reduce(
      (memo, operator) => ({
        ...memo,
        [operator](field: string, value: string) {
          concatValue(operator, `${field},${value}`);
          return api;
        },
      }),
      {}
    ),
    toString: function toString() {
      return returnString;
    },
  };

  return api;
}
