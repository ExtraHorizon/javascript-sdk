import * as nock from 'nock';
import createHttpClient from './client';
import createAuthHttpClient from './oauth2';
import { parseAuthParams } from './utils';

const mockParams = {
  apiHost: 'https://api.test.com',
  oauth: {
    clientId: '263bfa9a1d1ced19e228c28eb2a331f774184243',
    password: 'Azerty123',
    username: 'jens.verbeken@craftzing.com',
  },
};

describe('http client', () => {
  test('Create Axios client', async () => {
    const http = createHttpClient(mockParams);
    const authConfig = parseAuthParams(mockParams.oauth);
    const httpWithAuth = createAuthHttpClient(http, mockParams, authConfig);

    expect(httpWithAuth).toBeDefined();
  });

  test('Create Axios client + check whether the authorization is added correctly', async () => {
    const mockToken = 'test';
    nock(mockParams.apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).get('/test').reply(200, '');

    const http = createHttpClient(mockParams);
    const authConfig = parseAuthParams(mockParams.oauth);
    const httpWithAuth = createAuthHttpClient(http, mockParams, authConfig);

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });
});
