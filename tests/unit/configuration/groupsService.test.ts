import nock from 'nock';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2, rqlBuilder } from '../../../src/index';
import {
  groupConfigResponse,
  groupConfigInput,
} from '../../__helpers__/configuration';

describe('Configuration: Groups Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
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

  it('should view a group configuration', async () => {
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .get(`/groups/${groupId}`)
      .reply(200, groupConfigResponse);

    const res = await sdk.configuration.getGroupsConfig(groupId);

    expect(res.data).toBeDefined();
    expect(res.staffConfiguration).toBeDefined();
    expect(res.patientConfiguration).toBeDefined();
  });

  it('should update a group configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .put(`/groups/${groupId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configuration.updateGroupsConfig(
      groupId,
      groupConfigInput,
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from a group configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .post(`/groups/${groupId}/deleteFields`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configuration.removeFieldsFromGroupsConfig(
      groupId,
      {
        fields: ['data.enableEpicFeature'],
      },
      {
        rql,
      }
    );

    expect(res.affectedRecords).toBe(1);
  });
});
