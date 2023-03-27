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
import { OAuth1HttpClient, ParamsOauth1 } from '../../../src/types';

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

describe('OAuth1HttpClient', () => {
  const config = validateConfig(mockParams) as ParamsOauth1;
  const http = createHttpClient({ ...config, packageVersion: '' });
  let httpWithAuth: OAuth1HttpClient;

  beforeEach(() => {
    nock.cleanAll();
    httpWithAuth = createOAuth1HttpClient(http, config);
  });

  it('should authorize', async () => {
    const mockToken = 'test';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.extraAuthMethods.authenticate(oauthEmailMock);
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

    await httpWithAuth.extraAuthMethods.authenticate(oauthEmailMock);
    nock(mockParams.host).get('/test').reply(200, '');

    const result = httpWithAuth.extraAuthMethods.logout();

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
      await httpWithAuth.extraAuthMethods.authenticate(oauthEmailMock);
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
      await httpWithAuth.extraAuthMethods.authenticate(oauthEmailMock);
      await httpWithAuth.get('test');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
    }
  });

  it('should authorize with valid token/tokenSecret', async () => {
    expect.assertions(1);
    nock(mockParams.host)
      .get(`${USER_BASE}/me`)
      .reply(200, { id: 'mockUserId' });

    try {
      await httpWithAuth.extraAuthMethods.authenticate(oauthTokenMock);
      const userId = await httpWithAuth.userId;
      expect(userId).toBeDefined();
    } catch (error) {
      console.log(error);
    }
  });

  it('should authorize with valid token/tokenSecret/skipTokenCheck and get a userId', async () => {
    expect.assertions(1);
    nock(mockParams.host)
      .get(`${USER_BASE}/me`)
      .reply(200, { id: 'mockUserId' });

    try {
      await httpWithAuth.extraAuthMethods.authenticate({
        ...oauthTokenMock,
        skipTokenCheck: true,
      });
      const userId = await httpWithAuth.userId;
      expect(userId).toBeDefined();
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
      await httpWithAuth.extraAuthMethods.authenticate(oauthTokenMock);
    } catch (error) {
      expect(error).toBeInstanceOf(OauthTokenError);
    }
  });
});
