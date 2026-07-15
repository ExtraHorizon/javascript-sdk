import nock from 'nock';
import { createOAuth1Client, rqlBuilder } from '../../../../src';
import { AUTH_BASE } from '../../../../src/constants';
import { createPagedResponse } from '../../../__helpers__/utils';

describe('OAuth2 Authorizations', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const exh = createOAuth1Client({
    host,
    consumerKey: '',
    consumerSecret: '',
    token: '',
    tokenSecret: '',
  });

  const authorizationResponse = {
    id: '6a420d13278e74437dac51b8',
    clientId: '6a573f7bfc74a680ead9558a',
    userId: '6a420d376faa458591f17503',
    redirectUri: 'http://localhost:3000',
    state: 'active',
    codeChallengeMethod: 'S256',
    codeChallenge: '1234',
    authorizationCode: '047c3bc9eddb1e44b9818e1b5a8cba21d28d8099',
    expiryTimestamp: '2026-06-29T06:31:30.430Z',
    updateTimestamp: '2026-06-29T06:15:31.303Z',
    creationTimestamp: '2026-06-29T06:15:31.303Z',
  };

  const authorization = {
    ...authorizationResponse,
    expiryTimestamp: new Date(authorizationResponse.expiryTimestamp),
    updateTimestamp: new Date(authorizationResponse.updateTimestamp),
    creationTimestamp: new Date(authorizationResponse.creationTimestamp),
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('Finds authorizations', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/authorizations')
      .reply(200, createPagedResponse([authorizationResponse, authorizationResponse]));

    const response = await exh.auth.oauth2.authorizations.find();
    expect(response.data).toStrictEqual([authorization, authorization]);
  });

  it('Finds all authorizations', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/authorizations?limit(50)')
      .reply(200, createPagedResponse([authorizationResponse], { total: 2, offset: 0, limit: 1 }));

    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/authorizations?limit(1,1)')
      .reply(200, createPagedResponse([authorizationResponse], { total: 2, offset: 1, limit: 1 }));

    const response = await exh.auth.oauth2.authorizations.findAll();
    expect(response).toStrictEqual([authorization, authorization]);
  });

  it('Find the first authorization', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/authorizations?eq(userId,6a420d376faa458591f17503)')
      .reply(200, createPagedResponse([authorizationResponse, authorizationResponse]));

    const response = await exh.auth.oauth2.authorizations.findFirst({
      rql: rqlBuilder().eq('userId', '6a420d376faa458591f17503').build(),
    });

    expect(response).toStrictEqual(authorization);
  });

  it('Finds an authorization by its id', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/authorizations?eq(id,6a420d13278e74437dac51b8)')
      .reply(200, createPagedResponse(authorizationResponse));

    const response = await exh.auth.oauth2.authorizations.findById('6a420d13278e74437dac51b8');
    expect(response).toStrictEqual(authorization);
  });

  it('Removes an authorization', async () => {
    nock(`${host}${AUTH_BASE}`)
      .delete('/oauth2/authorizations/6a420d13278e74437dac51b8')
      .reply(200, { affectedRecords: 1 });

    const response = await exh.auth.oauth2.authorizations.remove('6a420d13278e74437dac51b8');
    expect(response.affectedRecords).toBe(1);
  });
});
