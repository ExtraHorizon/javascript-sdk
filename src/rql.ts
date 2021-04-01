export default function rqlBuilder() {
  let returnString = '';

  const concatValue = function concatValue(operation, value) {
    const seperator = returnString.startsWith('?') ? '&' : '?';
    returnString = returnString
      .concat(seperator)
      .concat(`${operation}(${value})`);
  };

  const concatKeyValue = function concatKeyValue(
    operation: string,
    key: string,
    value: string
  ) {
    const seperator = returnString.startsWith('?') ? '&' : '?';
    returnString = returnString
      .concat(seperator)
      .concat(`${operation}(${key},${value})`);
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
          concatKeyValue('in', field, list.join(','));
          return api;
        },
      }),
      {}
    ),
    ...['ge', 'eq', 'gt', 'lt', 'le', 'ne', 'like'].reduce(
      (memo, operator) => ({
        ...memo,
        [operator](field: string, value: string) {
          concatKeyValue(operator, field, value);
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
