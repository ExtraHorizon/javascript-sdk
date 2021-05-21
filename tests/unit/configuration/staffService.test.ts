import nock from 'nock';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';

describe('Configuration: Patients Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const userId = '52adef123456789abcdef123';
  const groupId = 'abcdef123456789abcdef123';

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(apiHost)
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
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .put(`/users/${userId}/staffConfigurations/${groupId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configuration.updateStaffConfig(groupId, userId, {
      data: {
        epicFeatureEnabled: true,
      },
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from a staff configuration for a group of a user', async () => {
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .post(`/users/${userId}/staffConfigurations/${groupId}/deleteFields`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configuration.removeFieldsFromStaffConfig(
      groupId,
      userId,
      {
        fields: ['data.enableEpicFeature'],
      }
    );

    expect(res.affectedRecords).toBe(1);
  });
});
