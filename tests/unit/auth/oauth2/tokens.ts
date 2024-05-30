// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createOAuth1Client, rqlBuilder } from '../../../../src';
import { AUTH_BASE } from '../../../../src/constants';
import { createPagedResponse } from '../../../__helpers__/utils';

describe('exh.auth.oauth2.tokens', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const sdk = createOAuth1Client({
    host,
    consumerKey: '',
    consumerSecret: '',
    token: '',
    tokenSecret: '',
  });

  const tokenResponse = {
    id: '5bfbfc3146e0fb321rsa4b28',
    userId: '5bfbfc3146e0fb321rsa4b28',
    applicationId: '5bfbfc3146e0fb321rsa4b28',
    refreshTokenId: '5bfbfc3146e0fb321rsa4b28',
    accessToken: '46e0fb321rsa4b285bfbfc3146e0fb321rsa4b28',
    expiryTimestamp: '2024-05-30T13:47:45.981Z',
    updateTimestamp: '2024-05-30T13:47:45.981Z',
    creationTimestamp: '2024-05-30T13:47:45.981Z',
  };

  const token = {
    ...tokenResponse,
    expiryTimestamp: new Date(tokenResponse.expiryTimestamp),
    updateTimestamp: new Date(tokenResponse.updateTimestamp),
    creationTimestamp: new Date(tokenResponse.creationTimestamp),
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('Finds tokens', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/tokens')
      .reply(200, createPagedResponse([tokenResponse, tokenResponse]));

    const result = await sdk.auth.oauth2.tokens.find();

    expect(result.data).toStrictEqual([token, token]);
  });

  it('Find the first token', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/tokens?eq(userId,5bfbfc3146e0fb321rsa4b28)')
      .reply(200, createPagedResponse([tokenResponse, tokenResponse]));

    const result = await sdk.auth.oauth2.tokens.findFirst({
      rql: rqlBuilder().eq('userId', '5bfbfc3146e0fb321rsa4b28').build(),
    });

    expect(result).toStrictEqual(token);
  });

  it('Finds a token by its id', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/tokens?eq(id,5bfbfc3146e0fb321rsa4b28)')
      .reply(200, createPagedResponse(tokenResponse));

    const result = await sdk.auth.oauth2.tokens.findById('5bfbfc3146e0fb321rsa4b28');

    expect(result).toStrictEqual(token);
  });

  it('Removes a token', async () => {
    nock(`${host}${AUTH_BASE}`)
      .delete('/oauth2/tokens/5bfbfc3146e0fb321rsa4b28')
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.auth.oauth2.tokens.remove('5bfbfc3146e0fb321rsa4b28');

    expect(result).toStrictEqual({ affectedRecords: 1 });
  });
});
