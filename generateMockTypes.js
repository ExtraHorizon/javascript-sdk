var { recursiveMap, getMockSdk } = require('./build/index.cjs.js');

const sdk = getMockSdk({ host: '', clientId: '' });

console.log(
  'export type MockClient<MockFn> =',
  JSON.stringify(
    {
      ...recursiveMap(value =>
        typeof value === 'function' ? 'MockFn;' : value
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
          [verb]: 'MockFn;',
        }),
        {}
      ),
    },
    null,
    2
  )
    .replace(/"/g, '')
    .replace(/,/g, '')
    .replace(/}/g, '};')
);
