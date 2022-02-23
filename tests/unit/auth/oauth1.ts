// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import { Client, createOAuth1Client, ParamsOauth1 } from '../../../src/index';
import { userData } from '../../__helpers__/user';

describe('Auth - OAuth1', () => {
  const host = 'https://api.xxx.fibricheck.com';

  let sdk: Client<ParamsOauth1>;

  beforeAll(async () => {
    sdk = createOAuth1Client({
      host,
      consumerKey: '',
      consumerSecret: '',
      requestLogger: value => value,
      responseLogger: value => value,
    });

    await sdk.auth.authenticate({
      token: '',
      tokenSecret: '',
      skipTokenCheck: true,
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should get me', async () => {
    nock(`${host}${USER_BASE}`).get('/me').reply(200, userData);

    const me = await sdk.users.me();

    expect(me.id).toBeDefined();
  });

  it('should get me with error', async () => {
    expect.assertions(1);
    try {
      nock(`${host}${USER_BASE}`).get('/me').reply(400);
      await sdk.users.me();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should confirm Mfa', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post('/oauth1/tokens/mfa')
      .reply(200, { token: 'token', tokenSecret: 'tokenSecret' });
    await sdk.auth.confirmMfa({
      token: 'token',
      methodId: 'methodId',
      code: 'code',
    });
  });

  it('should generate a ssoToken', async () => {
    const ssoToken = {
      ssoToken: 'fakeSsoToken',
    };
    nock(`${host}${AUTH_BASE}`)
      .post('/oauth1/ssoTokens/generate')
      .reply(200, ssoToken);

    const ssoTokenResult = await sdk.auth.oauth1.generateSsoToken();
    expect(ssoTokenResult.ssoToken).toEqual(ssoToken.ssoToken);
  });

  it('should consume a ssoToken', async () => {
    const ssoResponse = {
      token: 'fakeToken',
    };
    nock(`${host}${AUTH_BASE}`)
      .post('/oauth1/ssoTokens/consume')
      .reply(200, ssoResponse);

    const ssoTokenResult = await sdk.auth.oauth1.consumeSsoToken(
      'fakeSsoToken'
    );
    expect(ssoTokenResult.token).toEqual(ssoResponse.token);
  });

  it('should get tokens', async () => {
    const token = {
      id: 'fakeId',
    };
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth1/tokens')
      .reply(200, {
        page: {
          total: 5,
          offset: 0,
          limit: 20,
        },
        data: Array(5).fill(token),
      });

    const getTokensResult = await sdk.auth.oauth1.getTokens();

    expect(getTokensResult.data[0].id).toEqual(token.id);
  });

  it('should get delete a token', async () => {
    nock(`${host}${AUTH_BASE}`).delete('/oauth1/tokens/fakeId').reply(200, {
      affectedRecords: 1,
    });

    const getTokensResult = await sdk.auth.oauth1.removeToken('fakeId');

    expect(getTokensResult.affectedRecords).toEqual(1);
  });
});
