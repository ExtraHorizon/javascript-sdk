import nock from 'nock';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import {
  customUserConfigResponse,
  userConfigResponse,
} from '../../__helpers__/configuration';

describe('Configuration: Users Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const userId = '52adef123456789abcdef123';

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

  it('should retrieve a user configuration', async () => {
    nock(`${host}${CONFIGURATION_BASE}`)
      .get(`/users/${userId}`)
      .reply(200, userConfigResponse);

    const res = await sdk.configurations.users.get(userId);

    expect(res.data).toBeDefined();
    expect(res.staffConfigurations).toBeDefined();
    expect(res.patientConfigurations).toBeDefined();
  });

  it('Should not transform custom data in the response', async () => {
    //  const customResponseKeys = [ 'data.*', 'staffConfiguration.*', 'patientConfiguration.*' ];
    nock(`${host}${CONFIGURATION_BASE}`)
      .get(`/users/${userId}`)
      .reply(200, customUserConfigResponse);

    const response = await sdk.configurations.users.get(userId);
    expect(response).toStrictEqual({
      ...customUserConfigResponse,
      creationTimestamp: new Date(customUserConfigResponse.creationTimestamp),
      updateTimestamp: new Date(customUserConfigResponse.updateTimestamp),
    });
  });

  it('should update a user configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${CONFIGURATION_BASE}`).put(`/users/${userId}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.configurations.users.update(
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
    nock(`${host}${CONFIGURATION_BASE}`)
      .post(`/users/${userId}/deleteFields`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configurations.users.removeFields(
      userId,
      {
        fields: ['data.enableEpicFeature'],
      },
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });
});
