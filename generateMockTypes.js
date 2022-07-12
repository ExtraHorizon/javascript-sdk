var {
  recursiveMap,
  createOAuth2Client,
  createOAuth1Client,
  createProxyClient,
} = require('./build/index.cjs.js');

const RAW_VERBS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'request',
  'all',
  'head',
  'options',
];

const getRawMock = () => {
  const verbs = RAW_VERBS.reduce(
    (memo, verb) => ({
      ...memo,
      [verb]: 'MockFn;',
    }),
    {}
  );
  return {
    ...verbs,
    userId: 'MockFn;'
  }
};

console.log(
  'export type MockClientOAuth1<MockFn> =',
  JSON.stringify(
    {
      ...recursiveMap(value =>
        typeof value === 'function' ? 'MockFn;' : value
      )(createOAuth1Client({ host: '', clientId: '' })),
      raw: getRawMock()
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
      raw: getRawMock()
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
      raw: getRawMock()
    },
    null,
    2
  )
    .replace(/"/g, '')
    .replace(/,/g, '')
    .replace(/}/g, '};')
);
