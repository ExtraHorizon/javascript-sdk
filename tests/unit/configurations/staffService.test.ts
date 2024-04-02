import nock from 'nock';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';

describe('Configuration: Staff Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const userId = '52adef123456789abcdef123';
  const groupId = 'abcdef123456789abcdef123';

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
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
    nock.enableNetConnect();
  });

  it('should update a staff configuration for a group of a user', async () => {
    nock(`${host}${CONFIGURATION_BASE}`)
      .put(`/users/${userId}/staffConfigurations/${groupId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configurations.staff.update(groupId, userId, {
      data: {
        epicFeatureEnabled: true,
      },
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from a staff configuration for a group of a user', async () => {
    nock(`${host}${CONFIGURATION_BASE}`)
      .post(`/users/${userId}/staffConfigurations/${groupId}/deleteFields`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configurations.staff.removeFields(groupId, userId, {
      fields: ['data.enableEpicFeature'],
    });

    expect(res.affectedRecords).toBe(1);
  });
});
