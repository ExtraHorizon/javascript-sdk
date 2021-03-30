import * as nock from 'nock';
import { ApiError } from '../errors';
import createHttpClient from './client';
import createAuthHttpClient from './oauth2';
import { parseAuthParams } from './utils';

const mockParams = {
  apiHost: 'https://api.test.com',
  oauth: {
    clientId: '',
    password: '',
    username: '',
  },
};

describe('http client', () => {
  const http = createHttpClient(mockParams);
  const authConfig = parseAuthParams(mockParams.oauth);
  const httpWithAuth = createAuthHttpClient(http, mockParams, authConfig);

  test('Create Axios client', async () => {
    expect(httpWithAuth).toBeDefined();
  });

  test('Make call with authorization', async () => {
    const mockToken = 'test';
    nock(mockParams.apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });

  test('Make call with authorization but with wrong password', async () => {
    expect.assertions(1);
    nock(mockParams.apiHost).post('/auth/v2/oauth2/token').reply(400, {
      error: 'invalid_grant',
      description: 'this password email combination is unknown',
    });

    try {
      await httpWithAuth.get('test');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
    }
  });
});
