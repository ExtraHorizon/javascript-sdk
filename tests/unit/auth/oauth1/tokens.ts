import nock from 'nock';
import { createOAuth1Client, rqlBuilder } from '../../../../src';
import { AUTH_BASE } from '../../../../src/constants';
import { createPagedResponse } from '../../../__helpers__/utils';

describe('exh.auth.oauth1.tokens', () => {
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
    token: '46e0fb321rsa4b285bfbfc3146e0fb321rsa4b28',
    tokenSecret: '46e0fb321rsa4b285bfbfc3146e0fb321rsa4b28',
    lastUsedTimestamp: '2024-05-30T13:47:45.981Z',
    creationTimestamp: '2024-05-30T13:47:45.981Z',
  };

  const token = {
    ...tokenResponse,
    lastUsedTimestamp: new Date(tokenResponse.lastUsedTimestamp),
    creationTimestamp: new Date(tokenResponse.creationTimestamp),
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('Finds tokens', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth1/tokens')
      .reply(200, createPagedResponse([tokenResponse, tokenResponse]));

    const result = await sdk.auth.oauth1.tokens.find();

    expect(result.data).toStrictEqual([token, token]);
  });

  it('Find the first token', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth1/tokens?eq(userId,5bfbfc3146e0fb321rsa4b28)')
      .reply(200, createPagedResponse([tokenResponse, tokenResponse]));

    const result = await sdk.auth.oauth1.tokens.findFirst({
      rql: rqlBuilder().eq('userId', '5bfbfc3146e0fb321rsa4b28').build(),
    });

    expect(result).toStrictEqual(token);
  });

  it('Finds a token by its id', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth1/tokens?eq(id,5bfbfc3146e0fb321rsa4b28)')
      .reply(200, createPagedResponse(tokenResponse));

    const result = await sdk.auth.oauth1.tokens.findById('5bfbfc3146e0fb321rsa4b28');

    expect(result).toStrictEqual(token);
  });

  it('Removes a token', async () => {
    nock(`${host}${AUTH_BASE}`)
      .delete('/oauth1/tokens/5bfbfc3146e0fb321rsa4b28')
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.auth.oauth1.tokens.remove('5bfbfc3146e0fb321rsa4b28');

    expect(result).toStrictEqual({ affectedRecords: 1 });
  });
});
