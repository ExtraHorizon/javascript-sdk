import nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import {
  ApiError,
  AuthenticationError,
  BodyFormatError,
  InvalidGrantError,
  MfaRequiredError,
  OAuth2LoginError,
  RefreshTokenUnknownError,
  ResourceUnknownError,
  UnsupportedGrantTypeError,
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

const exampleAccessToken = 'AnAccessToken';
const exampleRefreshToken = 'ARefreshToken';
const tokenCreationResponse = {
  access_token: exampleAccessToken,
  refresh_token: exampleRefreshToken,
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

  it('should accept refreshToken/accessToken during creation and be authorized', async () => {
    const localHttpWithAuth = createOAuth2HttpClient(http, {
      ...mockParams,
      refreshToken: 'MyRefreshToken',
      accessToken: 'MyAccessToken',
    });

    // Expect successive requests to be authenticated with the accessToken
    nock(mockParams.host).get('/test').reply(200);

    const result = await localHttpWithAuth.get('test');
    expect(result.request.headers.authorization).toBe(`Bearer MyAccessToken`);

    // Expect the refreshToken to be used when the accessToken is expired
    nock(mockParams.host).get('/test').reply(400, {
      code: 118,
      name: 'ACCESS_TOKEN_EXPIRED_EXCEPTION',
      description: 'The access token is expired',
    });

    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`, {
        client_id: 'my-client-id',
        grant_type: 'refresh_token',
        refresh_token: 'MyRefreshToken',
      })
      .reply(200, { access_token: 'NewAccessToken' });

    nock(mockParams.host).get('/test').reply(200);

    const resultAfterExpiry = await localHttpWithAuth.get('test');
    expect(resultAfterExpiry.request.headers.authorization).toBe(
      'Bearer NewAccessToken'
    );
  });

  it('should authorize', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, tokenCreationResponse);

    const authenticateResult = await httpWithAuth.extraAuthMethods.authenticate(
      emailAuthData
    );
    expect(authenticateResult).toStrictEqual({
      refreshToken: exampleRefreshToken,
      accessToken: exampleAccessToken,
    });

    nock(mockParams.host).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(
      `Bearer ${exampleAccessToken}`
    );
  });

  it('should authorize and logout', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, tokenCreationResponse);

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);

    // Expect requests to be authenticated as this point
    nock(mockParams.host).get('/test').reply(200);

    const authenticatedResult = await httpWithAuth.get('test');
    expect(authenticatedResult.request.headers.authorization).toBe(
      `Bearer ${exampleAccessToken}`
    );

    const result = httpWithAuth.extraAuthMethods.logout();
    expect(result).toBe(true);

    // Expect requests not to be authenticated after logging out
    nock(mockParams.host).get('/test').reply(200);

    const unauthenticatedResult = await httpWithAuth.get('test');
    expect(unauthenticatedResult.request.headers.authorization).toBeUndefined();
  });

  it('throws on authorization with wrong password', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(400, {
        error: 'invalid_grant',
        description: 'this password email combination is unknown',
        exh_error: {
          name: 'AUTHENTICATION_EXCEPTION',
          description: 'This password and email combination is unknown',
          code: 106,
        },
      });

    const error = await httpWithAuth.extraAuthMethods
      .authenticate(emailAuthData)
      .catch(e => e);

    expect(error).toBeInstanceOf(InvalidGrantError);
    expect(error.exhError).toBeInstanceOf(AuthenticationError);
  });

  it('should authorize but first reply with expired token, but then valid refresh', async () => {
    const expiredToken = 'expired access token';
    const newToken = 'new access token';

    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: expiredToken });

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);

    nock(mockParams.host)
      .get('/test')
      .matchHeader('Authorization', `Bearer ${expiredToken}`)
      .reply(400, {
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
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, tokenCreationResponse);

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);

    nock(mockParams.host).get('/test').reply(400, {
      code: 118,
      name: 'ACCESS_TOKEN_EXPIRED_EXCEPTION',
      description: 'The access token is expired',
    });

    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(400, {
        error: 'invalid_grant',
        description: 'The refresh token is unknown',
        exh_error: {
          name: 'REFRESH_TOKEN_UNKNOWN_EXCEPTION',
          description: 'The refresh token is unknown',
          code: 119,
        },
      });

    const error = await httpWithAuth.get('test').catch(e => e);
    expect(error).toBeInstanceOf(InvalidGrantError);
    expect(error.exhError).toBeInstanceOf(RefreshTokenUnknownError);
  });

  it('throws on authorization with reply twice with unknown token', async () => {
    /*  Authenticate => returns unknown access token
     *  The get call fails because ACCESS_TOKEN_UNKNOWN_EXCEPTION is returned
     *  this trigger the sdk to try and refresh the token
     *  the refresh token => returns invalid_grant
     */
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, tokenCreationResponse);

    await httpWithAuth.extraAuthMethods.authenticate(emailAuthData);

    nock(mockParams.host).get('/test').reply(400, {
      code: 117,
      name: 'ACCESS_TOKEN_UNKNOWN_EXCEPTION',
      message: 'The access token is unknown',
    });

    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(400, {
        error: 'invalid_grant',
        description: 'The refresh token is unknown',
        exh_error: {
          name: 'REFRESH_TOKEN_UNKNOWN_EXCEPTION',
          description: 'The refresh token is unknown',
          code: 119,
        },
      });

    const error = await httpWithAuth.get('test').catch(e => e);
    expect(error).toBeInstanceOf(InvalidGrantError);
    expect(error.exhError).toBeInstanceOf(RefreshTokenUnknownError);
  });

  it('should authorize with a refreshToken', async () => {
    expect.assertions(2);
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, (_uri, data) => {
        expect(data).toEqual({
          client_id: mockParams.clientId,
          grant_type: 'refresh_token',
          refresh_token: 'test',
        });

        return tokenCreationResponse;
      });

    await httpWithAuth.extraAuthMethods.authenticate({ refreshToken: 'test' });

    // Expect successive requests to be authenticated
    nock(mockParams.host).get('/test').reply(200, '');

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(
      `Bearer ${exampleAccessToken}`
    );
  });

  it('should authorize with MFA Enabled', async () => {
    // Setup the MFA error to be thrown on login
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(400, {
        error: 'mfa_required',
        description: 'Multifactor authentication is required for this user',
        exh_error: {
          name: 'MFA_REQUIRED_EXCEPTION',
          description: 'Multifactor authentication is required for this user',
          code: 129,
        },
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

    const mfaError = await httpWithAuth.extraAuthMethods
      .authenticate(emailAuthData)
      .catch(error => error);

    expect(mfaError).toBeInstanceOf(MfaRequiredError);
    expect(mfaError.exhError).toBeInstanceOf(MfaRequiredError);

    // Return a valid token for the confirm MFA call
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, tokenCreationResponse);

    const { mfa } = mfaError.response;
    const confirmMfaResult = await httpWithAuth.extraAuthMethods.confirmMfa({
      token: mfa.token,
      methodId: mfa.methods[0].id,
      code: 'code',
    });

    expect(confirmMfaResult).toStrictEqual({
      refreshToken: exampleRefreshToken,
      accessToken: exampleAccessToken,
    });

    // Expect successive requests to be authenticated
    nock(mockParams.host).get('/test').reply(200);

    const result = await httpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(
      `Bearer ${exampleAccessToken}`
    );
  });

  it('should authorize with confidential application', async () => {
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
      .reply(200, tokenCreationResponse);

    const authenticateResult =
      await confidentialHttpWithAuth.extraAuthMethods.authenticate(
        emailAuthData
      );
    expect(authenticateResult).toStrictEqual({
      refreshToken: exampleRefreshToken,
      accessToken: exampleAccessToken,
    });

    // Expect successive requests to be authenticated
    nock(mockParams.host).get('/test').reply(200, '');

    const result = await confidentialHttpWithAuth.get('test');

    expect(result.request.headers.authorization).toBe(
      `Bearer ${exampleAccessToken}`
    );
  });

  it('Authorizes an automatic token refresh as an confidential application', async () => {
    const expiredToken = 'expired access token';
    const newToken = 'new access token';
    const refreshToken = 'the refresh token';

    const client = createOAuth2HttpClient(http, {
      ...mockParams,
      clientId: 'clientId',
      clientSecret: 'secret',
      accessToken: expiredToken,
      refreshToken,
    });

    // Mock the expected call with the expired token
    nock(mockParams.host)
      .get('/test')
      .matchHeader('Authorization', `Bearer ${expiredToken}`)
      .reply(400, {
        code: 118,
        name: 'ACCESS_TOKEN_EXPIRED_EXCEPTION',
        description: 'The access token is expired',
      });

    // Mock the expected refresh call
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`, {
        client_id: 'clientId',
        client_secret: 'secret',
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .basicAuth({ user: 'clientId', pass: 'secret' })
      .reply(200, { access_token: newToken });

    // Mock the expected retry with the new token
    nock(mockParams.host)
      .get('/test')
      .reply(200, {});

    // Initiate the request
    const result = await client.get('test');

    expect(result.request.headers.authorization).toBe(`Bearer ${newToken}`);
  });

  it('Should allow a user to determine if an error is an instance of an OAuth2 error', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`, {
        grant_type: 'password',
        client_id: mockParams.clientId,
        username: 'exh+test@extrahorizon.com',
        password: 'gr8passwrdm8',
      })
      .reply(400, {
        error: 'unsupported_grant_type',
        description: 'Invalid grant type provided',
        exh_error: {
          name: 'UNSUPPORTED_GRANT_EXCEPTION',
          description: 'Invalid grant type provided',
          code: 121,
        },
      });

    const error = await httpWithAuth.extraAuthMethods
      .authenticate({
        username: 'exh+test@extrahorizon.com',
        password: 'gr8passwrdm8',
      })
      .catch(e => e);

    expect(error).toBeInstanceOf(UnsupportedGrantTypeError);
    expect(error).toBeInstanceOf(OAuth2LoginError);
    expect(error).toBeInstanceOf(ApiError);
  });

  it('Should allow a user to determine if an Exh error is an instance of an error', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`, {
        grant_type: 'password',
        client_id: mockParams.clientId,
        username: 'exh+test@extrahorizon.com',
        password: 'gr8passwrdm8',
      })
      .reply(400, {
        error: 'invalid_request',
        description:
          'malformed body: "Unexpected token n in JSON at position 2"',
        exh_error: {
          name: 'BODY_FORMAT_EXCEPTION',
          description:
            'malformed body: "Unexpected token n in JSON at position 2"',
          code: 22,
        },
      });

    const error = await httpWithAuth.extraAuthMethods
      .authenticate({
        username: 'exh+test@extrahorizon.com',
        password: 'gr8passwrdm8',
      })
      .catch(e => e);

    expect(error.exhError).toBeInstanceOf(BodyFormatError);
    expect(error.exhError).toBeInstanceOf(ApiError);
  });

  it('Should allow a user to receive an Exh error as a generic api error, when the received Exh error code has no error mapping', async () => {
    nock(mockParams.host)
      .post(`${AUTH_BASE}/oauth2/tokens`, {
        grant_type: 'password',
        client_id: mockParams.clientId,
        username: 'exh+test@extrahorizon.com',
        password: 'gr8passwrdm8',
      })
      .reply(400, {
        error: 'invalid_request',
        description:
          'malformed body: "Unexpected token n in JSON at position 2"',
        exh_error: {
          name: 'BODY_FORMAT_EXCEPTION',
          description:
            'malformed body: "Unexpected token n in JSON at position 2"',
          code: 69420,
        },
      });

    const error = await httpWithAuth.extraAuthMethods
      .authenticate({
        username: 'exh+test@extrahorizon.com',
        password: 'gr8passwrdm8',
      })
      .catch(e => e);

    expect(error.exhError).not.toBeInstanceOf(BodyFormatError);
    expect(error.exhError).toBeInstanceOf(ApiError);
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
