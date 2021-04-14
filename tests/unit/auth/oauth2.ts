// eslint-disable-next-line import/no-extraneous-dependencies
import * as nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import { ResourceUnknownError } from '../../../src/errors';
import { Client, client } from '../../../src/index';
import { authorizationList, newAuthorization } from '../../__helpers__/auth';

describe('Auth - OAuth2', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';

  let sdk: Client;

  beforeAll(() => {
    sdk = client({
      apiHost,
      oauth: {
        clientId: '',
        username: '',
        password: '',
      },
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Can create authorizations', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .post('/oauth2/authorizations')
      .reply(200, newAuthorization);

    const createdResult = await sdk.auth.createOauth2Authorization({
      responseType: 'code',
      clientId: '507f191e810c19729de860ea',
      state: '',
      scope: '',
      redirectUri: 'http://localhost',
    });

    expect(createdResult.id).toEqual(newAuthorization.id);
  });

  it('Can get authorizations', async () => {
    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .get('/oauth2/authorizations')
      .reply(200, authorizationList);

    const applications = await sdk.auth.getOauth2Authorizations();

    expect(applications.data).toBeDefined();
    expect(applications.data[0].id).toEqual(authorizationList.data[0].id);
  });

  it('Can delete authorization', async () => {
    const mockToken = 'mockToken';
    const authorizationId = '123';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .delete(`/oauth2/authorizations/${authorizationId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const deleteResult = await sdk.auth.deleteOauth2Authorization(
      authorizationId
    );

    expect(deleteResult.affectedRecords).toEqual(1);
  });

  it('Can not delete unknown resource authorization', async () => {
    const mockToken = 'mockToken';
    const authorizationId = '123';
    expect.assertions(1);
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    nock(`${apiHost}${AUTH_BASE}`)
      .delete(`/oauth2/authorizations/${authorizationId}`)
      .reply(404, {
        code: 16,
        name: 'RESOURCE_UNKNOWN_EXCEPTION',
        message: 'Requested resource is unknown',
      });

    try {
      await sdk.auth.deleteOauth2Authorization(authorizationId);
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceUnknownError);
    }
  });
});
