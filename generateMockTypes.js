var {
  recursiveMap,
  createOAuth2Client,
  createOAuth1Client,
  createProxyClient,
} = require('./build/index.cjs.js');

console.log(
  'export type MockClientOAuth1<MockFn> =',
  JSON.stringify(
    {
      ...recursiveMap(value =>
        typeof value === 'function' ? 'MockFn;' : value
      )(createOAuth1Client({ host: '', clientId: '' })),
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

console.log(
  'export type MockClientOAuth2<MockFn> =',
  JSON.stringify(
    {
      ...recursiveMap(value =>
        typeof value === 'function' ? 'MockFn;' : value
      )(createOAuth2Client({ host: '', clientId: '' })),
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

console.log(
  'export type MockClientProxy<MockFn> =',
  JSON.stringify(
    {
      ...recursiveMap(value =>
        typeof value === 'function' ? 'MockFn;' : value
      )(createProxyClient({ host: '' })),
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
