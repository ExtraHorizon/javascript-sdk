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
  let httpWithAuth;

  beforeEach(() => {
    nock.cleanAll();
    httpWithAuth = createAuthHttpClient(http, mockParams);
    httpWithAuth.authenticate(authConfig);
  });

  it('Create Axios client', async () => {
    expect(httpWithAuth).toBeDefined();
  });

  it('Make call with authorization', async () => {
    const mockToken = 'test';
    nock(mockParams.apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });

  it('Make call with authorization but with wrong password', async () => {
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

  it('Make call with authorization but first reply with expired token, but then valid refresh', async () => {
    const mockToken = 'expired access token';
    nock(mockParams.apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).get('/test').reply(400, {
      code: 118,
      error: 'invalid_grant',
      description: 'the associated authorization is expired',
    });

    nock(mockParams.apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: 'access token' });

    nock(mockParams.apiHost).get('/test').reply(200, {});

    const result = await httpWithAuth.get('test');

    expect(result.data).toBeDefined();
  });

  it('Make call with authorization but first reply with expired token, but then fail refresh', async () => {
    expect.assertions(2);
    const mockToken = 'expired access token';
    nock(mockParams.apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).post('/auth/v2/oauth2/token').reply(400, {
      error: 'invalid_grant',
      description: 'The refresh token is unknown',
    });

    nock(mockParams.apiHost).get('/test').reply(400, {
      code: 118,
      error: 'invalid_grant',
      description: 'the associated authorization is expired',
    });

    nock(mockParams.apiHost).get('/test').reply(200, {});

    try {
      await httpWithAuth.get('test');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.response.error).toBe('invalid_grant');
    }
  });

  it('Make call with authorization but reply twice with unknown token', async () => {
    const mockToken = 'unknown access token';
    nock(mockParams.apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).get('/test').reply(400, {
      code: 117,
      name: 'ACCESS_TOKEN_UNKNOWN_EXCEPTION',
      message: 'The access token is unknown',
    });

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
