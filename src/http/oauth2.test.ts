import * as nock from 'nock';
import { AUTH_BASE } from '../constants';
import { InvalidGrantError, MFARequiredError } from '../errors';
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
  let httpWithAuth: ReturnType<typeof createAuthHttpClient>;

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
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.authenticate(authConfig);
    nock(mockParams.apiHost).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });

  it('Make call with authorization but with wrong password', async () => {
    expect.assertions(1);
    nock(mockParams.apiHost).post(`${AUTH_BASE}/oauth2/token`).reply(400, {
      error: 'invalid_grant',
      description: 'this password email combination is unknown',
    });

    try {
      await httpWithAuth.authenticate(authConfig);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidGrantError);
    }
  });

  it('Make call with authorization but first reply with expired token, but then valid refresh', async () => {
    const mockToken = 'expired access token';
    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.authenticate(authConfig);
    nock(mockParams.apiHost).get('/test').reply(400, {
      code: 118,
      error: 'invalid_grant',
      description: 'the associated authorization is expired',
    });

    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: 'access token' });

    nock(mockParams.apiHost).get('/test').reply(200, {});

    const result = await httpWithAuth.get('test');

    expect(result.data).toBeDefined();
  });

  it('Make call with authorization but first reply with expired token, but then fail refresh', async () => {
    expect.assertions(2);
    const mockToken = 'expired access token';
    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).post(`${AUTH_BASE}/oauth2/token`).reply(400, {
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
      await httpWithAuth.authenticate(authConfig);
      await httpWithAuth.get('test');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidGrantError);
      expect(error.response.error).toBe('invalid_grant');
    }
  });

  it('Make call with authorization but reply twice with unknown token', async () => {
    /*  Authenticate => returns unknown access token
     *  The get call fails because 117 is returned
     *  this trigger the sdk to try and refresh the token
     *  the refresh token => returns invalid_grant
     */
    const mockToken = 'unknown access token';
    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(mockParams.apiHost).get('/test').reply(400, {
      code: 117,
      name: 'ACCESS_TOKEN_UNKNOWN_EXCEPTION',
      message: 'The access token is unknown',
    });

    nock(mockParams.apiHost).post(`${AUTH_BASE}/oauth2/token`).reply(400, {
      error: 'invalid_grant',
      description: 'The refresh token is unknown',
    });

    try {
      await httpWithAuth.authenticate(authConfig);
      await httpWithAuth.get('test');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidGrantError);
    }
  });

  it('Initialize with RefreshToken', async () => {
    expect.assertions(2);
    const mockToken = 'access token';
    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, (_uri, data) => {
        expect(data).toEqual({
          grant_type: 'refresh_token',
          refresh_token: 'test',
        });

        return { access_token: mockToken };
      });

    const refreshConfig = parseAuthParams({ refreshToken: 'test' });
    await httpWithAuth.authenticate(refreshConfig);
    nock(mockParams.apiHost).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });

  it('Initialize with MFA Enabled', async () => {
    expect.assertions(2);
    const mockToken = 'access token';
    nock(mockParams.apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(400, {
        error: 'mfa_required',
        description: 'Multifactor authentication is required for this user',
        mfa: {
          token: '608c038a830f40d7fe028a3f05c85b84f9040d37',
          tokenExpiresIn: 900000,
          methods: [
            {
              id: '507f191e810c19729de860ea',
              type: 'totp',
              name: 'Google Authenticator',
              tags: ['selected'],
            },
          ],
        },
      });

    nock(mockParams.apiHost).post(`${AUTH_BASE}/oauth2/token`).reply(200, {
      accessToken: mockToken,
    });

    nock(mockParams.apiHost).get('/test').reply(200, '');

    try {
      await httpWithAuth.authenticate(authConfig);
    } catch (error) {
      expect(error).toBeInstanceOf(MFARequiredError);
      const { mfa } = error.response;
      await httpWithAuth.confirmMfa({
        token: mfa.token,
        methodId: mfa.methods[0].id,
        code: 'code',
      });
      const result = await httpWithAuth.get('test');
      expect(result).toBeDefined();
    }
  });
});
