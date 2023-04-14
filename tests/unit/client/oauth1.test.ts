import nock from 'nock';
import { validateConfig } from '../../../src/utils';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import {
  AuthenticationError,
  MfaRequiredError,
  OauthTokenError,
} from '../../../src/errors';
import { createHttpClient } from '../../../src/http/client';
import { createOAuth1HttpClient } from '../../../src/http/oauth1';
import { OAuth1HttpClient } from '../../../src/types';

const mockParams = {
  host: 'https://api.test.com',
  consumerKey: 'MyConsumerKey',
  consumerSecret: 'S3cr3t',
};

const authEmailData = {
  email: 'test@example.com',
  password: 'S3cr3t',
};

const authTokenData = {
  token: 'MySuppliedToken',
  tokenSecret: 'S3cr3t',
};

const tokenResponse = {
  token: 'MyReceivedToken',
  tokenSecret: 'S3cr3t',
};

const userResponse = {
  id: 'mockUserId',
};

describe('OAuth1HttpClient', () => {
  const config = validateConfig(mockParams);
  const http = createHttpClient({ ...config, packageVersion: '' });
  let httpWithAuth: OAuth1HttpClient;

  beforeEach(() => {
    nock.cleanAll();
    httpWithAuth = createOAuth1HttpClient(http, config);
  });

  it('should accept token/tokenSecret during creation and be authenticated', async () => {
    const localHttpWithAuth = createOAuth1HttpClient(http, {
      ...mockParams,
      token: 'MyDirectToken',
      tokenSecret: 'S3cr3t',
    });

    nock(mockParams.host).get('/test').reply(200);

    const result = await localHttpWithAuth.get('test');

    expect(result.request.headers.authorization).toContain('MyDirectToken');
  });

  it('should authorize', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, tokenResponse);

    await httpWithAuth.extraAuthMethods.authenticate(authEmailData);

    nock(mockParams.host).get('/test').reply(200);

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toContain('MyReceivedToken');
  });

  it('should authorize with MFA', async () => {
    const mfaResponseData = {
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
    };

    nock(mockParams.host).post(`${AUTH_BASE}/oauth1/tokens`).reply(403, {
      name: 'MFA_REQUIRED_EXCEPTION',
      message: 'Multifactor authentication is required for this user',
      code: 129,
      mfa: mfaResponseData,
    });

    const mfaError = await httpWithAuth.extraAuthMethods
      .authenticate(authEmailData)
      .catch(error => error);
    expect(mfaError).toBeInstanceOf(MfaRequiredError);

    const mfaData = mfaError.response.mfa;
    expect(mfaData).toEqual(mfaResponseData);

    const mfaMethod = mfaData.methods[0];
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth1/tokens/mfa`, {
        token: mfaData.token,
        methodId: mfaMethod.id,
        code: '123',
      })
      .reply(200, tokenResponse);

    await httpWithAuth.extraAuthMethods.confirmMfa({
      token: mfaData.token,
      methodId: mfaMethod.id,
      code: '123',
    });

    nock(mockParams.host).get('/test').reply(200);

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toContain('MyReceivedToken');
  });

  it('should authorize and logout', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth1/tokens`)
      .reply(200, tokenResponse);

    await httpWithAuth.extraAuthMethods.authenticate(authEmailData);

    // Expect an authenticated call before logout
    nock(mockParams.host).get('/test').reply(200);

    const loggedInResult = await httpWithAuth.get('/test');
    expect(loggedInResult.request.headers.authorization).toContain(
      `MyReceivedToken`
    );

    const result = httpWithAuth.extraAuthMethods.logout();
    expect(result).toBe(true);

    // Expect an unauthenticated call after logout
    nock(mockParams.host).get('/test').reply(200);

    const loggedOutResult = await httpWithAuth.get('/test');
    expect(loggedOutResult.request.headers.authorization).not.toContain(
      `MyReceivedToken`
    );
  });

  it('throws on authorization with wrong password', async () => {
    expect.assertions(1);
    nock(mockParams.host).post(`${AUTH_BASE}/oauth1/tokens`).reply(400, {
      code: 106,
      name: 'AUTHENTICATION_EXCEPTION',
      message: 'this password email combination is unknown',
    });

    try {
      await httpWithAuth.extraAuthMethods.authenticate(authEmailData);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthenticationError);
    }
  });

  it('throws on authorization with unknown token', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(401, {
      code: 108,
      name: 'OAUTH_TOKEN_EXCEPTION',
      message: 'The consumer key and token combination is unknown',
    });

    try {
      await httpWithAuth.extraAuthMethods.authenticate(authTokenData);
    } catch (error) {
      expect(error).toBeInstanceOf(OauthTokenError);
    }
  });

  it('should authorize with valid token/tokenSecret', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(200, userResponse);

    await httpWithAuth.extraAuthMethods.authenticate(authTokenData);

    const userId = await httpWithAuth.userId;
    expect(userId).toBe(userResponse.id);

    // Expect successive requests to include the supplied token
    nock(mockParams.host).get('/test').reply(200);

    const result = await httpWithAuth.get('/test');
    expect(result.request.headers.authorization).toContain(`MySuppliedToken`);
  });

  it('should authorize with valid token/tokenSecret/skipTokenCheck and get a userId', async () => {
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(200, userResponse);

    await httpWithAuth.extraAuthMethods.authenticate({
      ...authTokenData,
      skipTokenCheck: true,
    });

    const userId = await httpWithAuth.userId;
    expect(userId).toBe(userResponse.id);
  });

  it('throws on authorization with invalid token/tokenSecret', async () => {
    expect.assertions(1);
    nock(mockParams.host).get(`${USER_BASE}/me`).reply(400, {
      code: 108,
      name: 'OAUTH_TOKEN_EXCEPTION',
      message: 'The consumer key and token combination is unknown',
    });

    try {
      await httpWithAuth.extraAuthMethods.authenticate(authTokenData);
    } catch (error) {
      expect(error).toBeInstanceOf(OauthTokenError);
    }
  });
});
