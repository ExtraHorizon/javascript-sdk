import nock from 'nock';
import { validateConfig } from '../../../src/utils';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import {
  ApiError,
  AuthenticationError,
  OauthTokenError,
} from '../../../src/errors';
import { createHttpClient } from '../../../src/http/client';
import { createOAuth1HttpClient } from '../../../src/http/oauth1';
import { parseAuthParams } from '../../../src/http/utils';
import { ConfigOauth1 } from '../../../src/types';

const mockParams = {
  host: 'https://api.test.com',
  consumerKey: '',
  consumerSecret: '',
};

const oauthEmailMock = {
  email: '',
  password: '',
};

const oauthTokenMock = {
  token: '',
  tokenSecret: '',
  consumerKey: '',
  consumerSecret: '',
};

describe('http client', () => {
  const config = validateConfig(mockParams) as ConfigOauth1;
  const http = createHttpClient({ ...config, packageVersion: '' });
  const authConfig = parseAuthParams(oauthEmailMock);
  let httpWithAuth;

  beforeEach(() => {
    nock.cleanAll();
    httpWithAuth = createOAuth1HttpClient(http, config);
  });

  it('should authorize', async () => {
    const mockToken = 'test';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.authenticate(authConfig);
    nock(mockParams.host).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toContain(
      `OAuth oauth_consumer_key`
    );
  });

  it('should authorize and logout', async () => {
    const mockToken = 'test';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.authenticate(authConfig);
    nock(mockParams.host).get('/test').reply(200, '');

    const result = httpWithAuth.logout();

    expect(result).toBe(true);
  });

  it('throws on authorization with wrong password', async () => {
    expect.assertions(1);
    nock(mockParams.host).post(`${AUTH_BASE}/oauth1/tokens`).reply(400, {
      code: 106,
      name: 'AUTHENTICATION_EXCEPTION',
      message: 'this password email combination is unknown',
    });

    try {
      await httpWithAuth.authenticate(authConfig);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthenticationError);
    }
  });

  it('throws on authorization with unknown token', async () => {
    const mockToken = 'unknown access token';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, { access_token: mockToken });

    nock(mockParams.host).get('/test').reply(400, {
      code: 117,
      name: 'ACCESS_TOKEN_UNKNOWN_EXCEPTION',
      message: 'The access token is unknown',
    });

    nock(mockParams.host).post(`${AUTH_BASE}/oauth1/tokens`).reply(400, {
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

  it('should authorize with valid token/tokenSecret', async () => {
    expect.assertions(1);
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(200, {});

    try {
      await httpWithAuth.authenticate(parseAuthParams(oauthTokenMock));
      expect(true).toBe(true);
    } catch (error) {
      console.log(error);
    }
  });

  it('throws on authorization with invalid token/tokenSecret', async () => {
    expect.assertions(1);
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(400, {
      code: 108,
      name: 'OAUTH_TOKEN_EXCEPTION',
      message: 'The consumer key and token combination is unknown',
    });

    try {
      await httpWithAuth.authenticate(parseAuthParams(oauthTokenMock));
    } catch (error) {
      expect(error).toBeInstanceOf(OauthTokenError);
    }
  });
});
