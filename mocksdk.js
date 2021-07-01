var createClient = require('./build/index.cjs.js').createClient;
var recursiveMap = require('./build/index.cjs.js').recursiveMap;

const sdk = createClient({ host: '', clientId: '' });

console.log(
  'export type MockClient<MockFn> =',
  JSON.stringify(
    {
      ...recursiveMap(value =>
        typeof value === 'function' ? 'MockFn' : value
      )(sdk),
      raw: [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'request',
        'all',
        'head',
        'options',
      ].reduce(
        (memo, verb) => ({
          ...memo,
          [verb]: 'MockFn',
        }),
        {}
      ),
    },
    null,
    2
  ).replace(/"/g, '')
);
