import nock from 'nock';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2, rqlBuilder } from '../../../src/index';
import {
  userConfigResponse,
  // groupConfigInput,
} from '../../__helpers__/configuration';

describe('Configuration: Users Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const userId = '52adef123456789abcdef123';

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

  it('should retrieve a user configuration', async () => {
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .get(`/users/${userId}`)
      .reply(200, userConfigResponse);

    const res = await sdk.configuration.getUsersConfig(userId);

    expect(res.data).toBeDefined();
    expect(res.staffConfigurations).toBeDefined();
    expect(res.patientConfigurations).toBeDefined();
  });

  it('should update a user configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${CONFIGURATION_BASE}`).put(`/users/${userId}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.configuration.updateUsersConfig(
      userId,
      {
        data: {
          epicFeatureEnabled: true,
        },
      },
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from a user configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .post(`/users/${userId}/deleteFields`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configuration.removeFieldsFromUsersConfig(
      userId,
      {
        fields: ['data.enableEpicFeature'],
      },
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });
});
