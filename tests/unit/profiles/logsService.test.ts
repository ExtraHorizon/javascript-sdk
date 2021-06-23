import nock from 'nock';
import { AUTH_BASE, PROFILES_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  profileData,
  groupData,
  logData,
  logsResponse,
} from '../../__helpers__/profile';

describe('Logs Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const profileId = profileData.id;
  const { groupId } = groupData;
  const logId = logData.id;

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

  it('should create a profile log entry', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .post(`/${profileId}/groups/${groupId}/logs`)
      .reply(200, logData);

    const log = await sdk.profiles.logs.create(profileId, groupId, {
      text: 'string',
    });

    expect(log.id).toBe(logId);
  });

  it('should retrieve all profile log entries', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get(`/${profileId}/groups/${groupId}/logs`)
      .reply(200, logsResponse);

    const res = await sdk.profiles.logs.find(profileId, groupId);

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should update a profile log entry', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .put(`/${profileId}/groups/${groupId}/logs/${logId}`)
      .reply(200, logData);

    const log = await sdk.profiles.logs.update(profileId, groupId, logId, {
      text: 'string',
    });

    expect(log.id).toBe(logId);
  });

  it('should delete a profile log entry', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .delete(`/${profileId}/groups/${groupId}/logs/${logId}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.profiles.logs.remove(profileId, groupId, logId);

    expect(res.affectedRecords).toBe(1);
  });
});
