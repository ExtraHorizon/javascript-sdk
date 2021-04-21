import * as nock from 'nock';
import { AUTH_BASE } from '../constants';
import { ApiError } from '../errors';
import createHttpClient from './client';
import createAuthHttpClient from './oauth1';
import { parseAuthParams } from './utils';

const mockParams = {
  apiHost: 'https://api.test.com',
  oauth: {
    email: '',
    password: '',
    consumerKey: '',
    consumerSecret: '',
  },
};

describe('http client', () => {
  const http = createHttpClient(mockParams);
  const authConfig = parseAuthParams(mockParams.oauth);
  let httpWithAuth;

  beforeEach(() => {
    nock.cleanAll();
    httpWithAuth = createAuthHttpClient(http, mockParams);
  });

  it('Create Axios client', async () => {
    expect(httpWithAuth).toBeDefined();
  });

  it('Make call with authorization', async () => {
    const mockToken = 'test';
    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.authenticate(authConfig);
    nock(mockParams.apiHost).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toContain(
      `OAuth oauth_consumer_key`
    );
  });

  it('Make call with authorization but with wrong password', async () => {
    expect.assertions(1);
    nock(mockParams.apiHost).post(`${AUTH_BASE}/oauth1/tokens`).reply(400, {
      error: 'invalid_grant',
      description: 'this password email combination is unknown',
    });

    try {
      await httpWithAuth.authenticate(authConfig);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
    }
  });

  it('Make call with authorization but reply twice with unknown token', async () => {
    const mockToken = 'unknown access token';
    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).get('/test').reply(400, {
      code: 117,
      name: 'ACCESS_TOKEN_UNKNOWN_EXCEPTION',
      message: 'The access token is unknown',
    });

    nock(mockParams.apiHost).post(`${AUTH_BASE}/oauth1/tokens`).reply(400, {
      error: 'invalid_grant',
      description: 'this password email combination is unknown',
    });

    try {
      await httpWithAuth.authenticate(authConfig);
      await httpWithAuth.get('test');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
    }
  });
});
