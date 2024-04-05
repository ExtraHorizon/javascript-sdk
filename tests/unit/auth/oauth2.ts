// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import { ResourceUnknownError } from '../../../src/errors';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { authorizationData } from '../../__helpers__/auth';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Auth - OAuth2', () => {
  const host = 'https://api.xxx.extrahorizon.io';

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
      requestLogger: value => value,
      responseLogger: value => value,
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should create an authorization', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post('/oauth2/authorizations')
      .reply(200, authorizationData);

    const createdResult = await sdk.auth.oauth2.createAuthorization({
      responseType: 'code',
      clientId: '507f191e810c19729de860ea',
      state: '',
      scope: '',
      redirectUri: 'http://localhost',
    });

    expect(createdResult.id).toEqual(authorizationData.id);
  });

  it('should get authorizations', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oauth2/authorizations')
      .reply(200, createPagedResponse(authorizationData));

    const applications = await sdk.auth.oauth2.getAuthorizations();

    expect(applications.data).toBeDefined();
    expect(applications.data[0].id).toEqual(authorizationData.id);
  });

  it('should delete an authorization', async () => {
    const authorizationId = '123';

    nock(`${host}${AUTH_BASE}`)
      .delete(`/oauth2/authorizations/${authorizationId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const deleteResult = await sdk.auth.oauth2.deleteAuthorization(
      authorizationId
    );

    expect(deleteResult.affectedRecords).toEqual(1);
  });

  it('throws on deleting unknown authorization', async () => {
    const authorizationId = '123';
    expect.assertions(1);

    nock(`${host}${AUTH_BASE}`)
      .delete(`/oauth2/authorizations/${authorizationId}`)
      .reply(404, {
        code: 16,
        name: 'RESOURCE_UNKNOWN_EXCEPTION',
        message: 'Requested resource is unknown',
      });

    try {
      await sdk.auth.oauth2.deleteAuthorization(authorizationId);
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });
});
