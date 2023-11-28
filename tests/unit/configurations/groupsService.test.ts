import nock from 'nock';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import {
  customGroupConfigResponse,
  groupConfigInput,
  groupConfigResponse,
} from '../../__helpers__/configuration';

describe('Configuration: Groups Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
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

  it('should view a group configuration', async () => {
    nock(`${host}${CONFIGURATION_BASE}`)
      .get(`/groups/${groupId}`)
      .reply(200, groupConfigResponse);

    const res = await sdk.configurations.groups.get(groupId);

    expect(res.data).toBeDefined();
    expect(res.staffConfiguration).toBeDefined();
    expect(res.patientConfiguration).toBeDefined();
  });

  it('Should not transform custom data in the response', async () => {
    //  const customResponseKeys = [ 'data.*', 'staffConfiguration.*', 'patientConfiguration.*' ];
    nock(`${host}${CONFIGURATION_BASE}`)
      .get(`/groups/${groupId}`)
      .reply(200, customGroupConfigResponse);

    const response = await sdk.configurations.groups.get(groupId);
    expect(response).toStrictEqual({
      ...customGroupConfigResponse,
      creationTimestamp: new Date(customGroupConfigResponse.creationTimestamp),
      updateTimestamp: new Date(customGroupConfigResponse.updateTimestamp),
    });
  });

  it('should update a group configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${CONFIGURATION_BASE}`).put(`/groups/${groupId}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.configurations.groups.update(
      groupId,
      groupConfigInput,
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from a group configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${CONFIGURATION_BASE}`)
      .post(`/groups/${groupId}/deleteFields`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configurations.groups.removeFields(
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
