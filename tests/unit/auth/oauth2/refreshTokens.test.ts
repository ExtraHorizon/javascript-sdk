import nock from 'nock';
import { createOAuth1Client, rqlBuilder } from '../../../../src';
import { AUTH_BASE } from '../../../../src/constants';
import { createPagedResponse } from '../../../__helpers__/utils';

describe('OAuth2 Refresh Tokens', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const exh = createOAuth1Client({
    host,
    consumerKey: '',
    consumerSecret: '',
    token: '',
    tokenSecret: '',
  });

  const refreshTokenResponse = {
    id: '6a420d13278e74437dac51b8',
    applicationId: '6a420d2c3ff2290a376e7cf6',
    userId: '6a420d376faa458591f17503',
    expiryTimestamp: '2026-06-29T06:31:30.430Z',
    updateTimestamp: '2026-06-29T06:15:31.303Z',
    creationTimestamp: '2026-06-29T06:15:31.303Z',
  };

  const refreshToken = {
    ...refreshTokenResponse,
    expiryTimestamp: new Date(refreshTokenResponse.expiryTimestamp),
    updateTimestamp: new Date(refreshTokenResponse.updateTimestamp),
    creationTimestamp: new Date(refreshTokenResponse.creationTimestamp),
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('Finds tokens', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/refreshTokens')
      .reply(200, createPagedResponse([refreshTokenResponse, refreshTokenResponse]));

    const response = await exh.auth.oauth2.refreshTokens.find();
    expect(response.data).toStrictEqual([refreshToken, refreshToken]);
  });

  it('Finds all tokens', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/refreshTokens?limit(50)')
      .reply(200, createPagedResponse([refreshTokenResponse], { total: 2, offset: 0, limit: 1 }));

    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/refreshTokens?limit(1,1)')
      .reply(200, createPagedResponse([refreshTokenResponse], { total: 2, offset: 1, limit: 1 }));

    const response = await exh.auth.oauth2.refreshTokens.findAll();
    expect(response).toStrictEqual([refreshToken, refreshToken]);
  });

  it('Find the first token', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/refreshTokens?eq(userId,6a420d376faa458591f17503)')
      .reply(200, createPagedResponse([refreshTokenResponse, refreshTokenResponse]));

    const response = await exh.auth.oauth2.refreshTokens.findFirst({
      rql: rqlBuilder().eq('userId', '6a420d376faa458591f17503').build(),
    });

    expect(response).toStrictEqual(refreshToken);
  });

  it('Finds a token by its id', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/refreshTokens?eq(id,6a420d13278e74437dac51b8)')
      .reply(200, createPagedResponse(refreshTokenResponse));

    const response = await exh.auth.oauth2.refreshTokens.findById('6a420d13278e74437dac51b8');
    expect(response).toStrictEqual(refreshToken);
  });

  it('Removes a token', async () => {
    nock(`${host}${AUTH_BASE}`)
      .delete('/oauth2/refreshTokens/6a420d13278e74437dac51b8')
      .reply(200, { affectedRecords: 1 });

    const response = await exh.auth.oauth2.refreshTokens.remove('6a420d13278e74437dac51b8');
    expect(response.affectedRecords).toBe(1);
  });
});
