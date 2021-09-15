import nock from 'nock';
import { AUTH_BASE, PROFILES_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { profileData, groupData, logData } from '../../__helpers__/profile';
import { createPagedResponse } from '../../__helpers__/utils';

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
      .get(`/${profileId}/groups/${groupId}/logs/`)
      .reply(200, createPagedResponse(logData));

    const res = await sdk.profiles.logs.find(profileId, groupId);

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all profile log entries', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get(`/${profileId}/groups/${groupId}/logs/?limit(50)`)
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(logData),
      })
      .get(`/${profileId}/groups/${groupId}/logs/?limit(50,50)`)
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(logData),
      });
    const res = await sdk.profiles.logs.findAll(profileId, groupId);
    expect(res.length).toBe(65);
  });

  it('should request a list of all profile log entries via iterator', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get(`/${profileId}/groups/${groupId}/logs/?limit(50)`)
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(logData),
      })
      .get(`/${profileId}/groups/${groupId}/logs/?limit(50,50)`)
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(logData),
      });
    const profileLogs = sdk.profiles.logs.findAllIterator(profileId, groupId);

    await profileLogs.next();
    const thirdPage = await profileLogs.next();
    expect(thirdPage.value.data.length).toBe(5);
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
