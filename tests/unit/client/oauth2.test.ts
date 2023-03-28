import nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import {
  InvalidGrantError,
  MfaRequiredError,
  ResourceUnknownError,
} from '../../../src/errors';
import { createHttpClient } from '../../../src/http/client';
import { createOAuth2HttpClient } from '../../../src/http/oauth2';
import { OAuth2HttpClient, ParamsOauth2 } from '../../../src/types';
import { validateConfig } from '../../../src/utils';

const freshTokensCallbackMock = jest.fn();

const mockParams = {
  host: 'https://api.test.com',
  clientId: 'my-client-id',
  freshTokensCallback: freshTokensCallbackMock,
};

const emailAuthData = {
  username: 'test@example.com',
  password: 'S3cr3t',
};

describe('OAuth2HttpClient', () => {
  const config = validateConfig(mockParams);
  const http = createHttpClient({ ...config, packageVersion: '' });
  let httpWithAuth: OAuth2HttpClient;

  beforeEach(() => {
    nock.cleanAll();
    freshTokensCallbackMock.mockReset();
    httpWithAuth = createOAuth2HttpClient(http, config);
  });

  it('should authorize', async () => {
    const mockToken = 'test';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    const authenticateResult = await httpWithAuth.extraAuthMethods.authenticate(
      emailAuthData
    );
    nock(mockParams.host).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
    expect(authenticateResult).toStrictEqual({ accessToken: 'test' });
  });

  it('should authorize and logout', async () => {
    const mockToken = 'test';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);
    nock(mockParams.host).get('/test').reply(200, '');

    const result = httpWithAuth.extraAuthMethods.logout();

    expect(result).toBe(true);
  });

  it('throws on authorization with wrong password', async () => {
    expect.assertions(1);
    nock(mockParams.host).post(`${AUTH_BASE}/oauth2/tokens`).reply(400, {
      error: 'invalid_grant',
      description: 'this password email combination is unknown',
    });

    try {
      await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidGrantError);
    }
  });

  it('should authorize but first reply with expired token, but then valid refresh', async () => {
    const expiredToken = 'expired access token';
    const newToken = 'new access token';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: expiredToken });

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);

    nock(mockParams.host).get('/test').reply(400, {
      code: 118,
      name: 'ACCESS_TOKEN_EXPIRED_EXCEPTION',
      description: 'The access token is expired',
    });

    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: newToken });

    nock(mockParams.host).get('/test').reply(200, {});

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${newToken}`);
  });

  it('throws with authorization but first reply with expired token, but then fail refresh', async () => {
    expect.assertions(2);
    const mockToken = 'expired access token';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);

    nock(mockParams.host).get('/test').reply(400, {
      code: 118,
      name: 'ACCESS_TOKEN_EXPIRED_EXCEPTION',
      description: 'The access token is expired',
    });

    nock(mockParams.host).post(`${AUTH_BASE}/oauth2/tokens`).reply(400, {
      error: 'invalid_grant',
      description: 'The refresh token is unknown',
    });

    try {
      await httpWithAuth.get('test');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidGrantError);
      expect(error.response.error).toBe('invalid_grant');
    }
  });

  it('throws on authorization with reply twice with unknown token', async () => {
    /*  Authenticate => returns unknown access token
     *  The get call fails because ACCESS_TOKEN_UNKNOWN_EXCEPTION is returned
     *  this trigger the sdk to try and refresh the token
     *  the refresh token => returns invalid_grant
     */
    const mockToken = 'unknown access token';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);

    nock(mockParams.host).get('/test').reply(400, {
      code: 117,
      name: 'ACCESS_TOKEN_UNKNOWN_EXCEPTION',
      message: 'The access token is unknown',
    });

    nock(mockParams.host).post(`${AUTH_BASE}/oauth2/tokens`).reply(400, {
      error: 'invalid_grant',
      description: 'The refresh token is unknown',
    });

    await expect(httpWithAuth.get('test')).rejects.toThrow(InvalidGrantError);
  });

  it('should authorize with a refreshToken', async () => {
    expect.assertions(2);
    const mockToken = 'access token';
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, (_uri, data) => {
        expect(data).toEqual({
          client_id: mockParams.clientId,
          grant_type: 'refresh_token',
          refresh_token: 'test',
        });

        return { access_token: mockToken };
      });

    await httpWithAuth.extraAuthMethods.authenticate({ refreshToken: 'test' });

    // Expect successive requests to be authenticated
    nock(mockParams.host).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should authorize with MFA Enabled', async () => {
    const mockToken = 'access token';

    // Setup the MFA error to be thrown on login
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
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

    let mfaError;
    try {
      await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);
    } catch (error) {
      mfaError = error;
    }
    expect(mfaError).toBeInstanceOf(MfaRequiredError);

    // Return a valid token for the confirm MFA call
    nock(mockParams.host).post(`${AUTH_BASE}/oauth2/tokens`).reply(200, {
      accessToken: mockToken,
    });

    const { mfa } = mfaError.response;
    const confirmMfaResult = await httpWithAuth.extraAuthMethods.confirmMfa({
      token: mfa.token,
      methodId: mfa.methods[0].id,
      code: 'code',
    });
    expect(confirmMfaResult).toStrictEqual({ accessToken: 'access token' });

    // Expect successive requests to be authenticated
    nock(mockParams.host).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should authorize with confidential application', async () => {
    const mockToken = 'test';

    const confidentialConfig = validateConfig({
      ...mockParams,
      clientId: 'clientId',
      clientSecret: 'secret',
    }) as ParamsOauth2;

    const confidentialHttpWithAuth = createOAuth2HttpClient(
      http,
      confidentialConfig
    );

    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .basicAuth({ user: 'clientId', pass: 'secret' })
      .reply(200, { access_token: mockToken });

    const authenticateResult =
      await confidentialHttpWithAuth.extraAuthMethods.authenticate(
        emailAuthData
      );
    expect(authenticateResult).toStrictEqual({ accessToken: mockToken });

    // Expect successive requests to be authenticated
    nock(mockParams.host).get('/test').reply(200, '');

    const result = await confidentialHttpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${mockToken}`);
  });

  describe('generateOidcAuthenticationUrl()', () => {
    const providerName = 'my-provider-name';
    const data = { state: 'my-state-value' };
    const responseData = {
      authenticationUrl:
        'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=123456789-abcdefghijklw.apps.googleusercontent.com&scope=openid%20email%20profile&redirect_uri=https://api.dev.yourapp.com/callback',
    };

    it('should generate an OIDC authentication URL', async () => {
      nock(mockParams.host)
        .post(
          `${AUTH_BASE}/oidc/providers/${providerName}/generateAuthenticationUrl`,
          data
        )
        .reply(200, responseData);

      const result =
        await httpWithAuth.extraAuthMethods.generateOidcAuthenticationUrl(
          providerName,
          data
        );
      expect(result).toEqual(responseData);
    });

    it('should accept the data not to be set', async () => {
      nock(mockParams.host)
        .post(
          `${AUTH_BASE}/oidc/providers/${providerName}/generateAuthenticationUrl`,
          {}
        )
        .reply(200, responseData);

      const result =
        await httpWithAuth.extraAuthMethods.generateOidcAuthenticationUrl(
          providerName
        );
      expect(result).toEqual(responseData);
    });

    it('should throw when generating an OIDC authentication URL fails', async () => {
      nock(mockParams.host)
        .post(
          `${AUTH_BASE}/oidc/providers/${providerName}/generateAuthenticationUrl`
        )
        .reply(404, {
          code: 16,
          name: 'RESOURCE_UNKNOWN_EXCEPTION',
          message: 'Requested resource is unknown',
        });

      await expect(
        httpWithAuth.extraAuthMethods.generateOidcAuthenticationUrl(
          providerName,
          data
        )
      ).rejects.toThrow(ResourceUnknownError);
    });
  });

  describe('authenticateWithOidc()', () => {
    const providerName = 'my-provider-name';
    const data = {
      authorizationCode: 'my-auth-code',
    };
    const requestBody = {
      client_id: mockParams.clientId,
      ...data,
    };
    const responseBody = {
      token_type: 'bearer',
      access_token: '3e9a827ed143c14e33617315c15789134367224c',
      expires_in: 86400,
      refresh_token: '3e9a827ed143c14e33617315c15789134367224c',
      user_id: '507f191e810c19729de860ea',
      application_id: '507f191e810c19729de860ea',
    };

    it('should authenticate with an OIDC provider', async () => {
      nock(mockParams.host)
        .post(
          `${AUTH_BASE}/oidc/providers/${providerName}/oAuth2Login`,
          requestBody
        )
        .reply(200, responseBody);

      await httpWithAuth.extraAuthMethods.authenticateWithOidc(
        providerName,
        data
      );

      nock(mockParams.host)
        .get('/test')
        .matchHeader('Authorization', `Bearer ${responseBody.access_token}`)
        .reply(200);

      await httpWithAuth.get('test');

      expect(nock.isDone()).toBe(true);
    });

    it('should return the oAuth2 token', async () => {
      nock(mockParams.host)
        .post(
          `${AUTH_BASE}/oidc/providers/${providerName}/oAuth2Login`,
          requestBody
        )
        .reply(200, responseBody);

      const result = await httpWithAuth.extraAuthMethods.authenticateWithOidc(
        providerName,
        data
      );
      expect(result).toEqual({
        tokenType: 'bearer',
        accessToken: '3e9a827ed143c14e33617315c15789134367224c',
        expiresIn: 86400,
        refreshToken: '3e9a827ed143c14e33617315c15789134367224c',
        applicationId: '507f191e810c19729de860ea',
        userId: '507f191e810c19729de860ea',
      });
    });

    it('should trigger the freshTokensCallback with the oAuth2 token', async () => {
      nock(mockParams.host)
        .post(
          `${AUTH_BASE}/oidc/providers/${providerName}/oAuth2Login`,
          requestBody
        )
        .reply(200, responseBody);

      await httpWithAuth.extraAuthMethods.authenticateWithOidc(
        providerName,
        data
      );

      expect(freshTokensCallbackMock).toHaveBeenCalledWith({
        tokenType: 'bearer',
        accessToken: '3e9a827ed143c14e33617315c15789134367224c',
        expiresIn: 86400,
        refreshToken: '3e9a827ed143c14e33617315c15789134367224c',
        applicationId: '507f191e810c19729de860ea',
        userId: '507f191e810c19729de860ea',
      });
    });
  });
});
