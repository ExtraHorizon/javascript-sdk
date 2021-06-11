import nock from 'nock';
import { AUTH_BASE, PROFILES_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { profileData, groupData } from '../../__helpers__/profile';

describe('Groups Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const profileId = profileData.id;
  const { groupId } = groupData;

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

  it('should add a group enlistment to a profile', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .post(`/${profileId}/groups`)
      .reply(200, groupData);

    const group = await sdk.profiles.groups.addGroupToProfile(
      profileId,
      groupData
    );

    expect(group.patientId).toBe(groupData.patientId);
  });

  it('should update a group enlistment on a profile', async () => {
    const newGroupData = {
      ...groupData,
      patientId: 'newPatientId',
      groupId: undefined,
    };

    nock(`${host}${PROFILES_BASE}`)
      .put(`/${profileId}/groups/${groupId}`)
      .reply(200, { ...newGroupData, groupId });

    const group = await sdk.profiles.groups.updateGroupOnProfile(
      profileId,
      groupId,
      newGroupData
    );

    expect(group.patientId).toBe('newPatientId');
  });

  it('should delete a group from a profile', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .delete(`/${profileId}/groups/${groupId}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.profiles.groups.removeGroupFromProfile(
      profileId,
      groupId
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove a field on a group enlistment object in a profile', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .post(`/${profileId}/groups/${groupId}/remove_fields`)
      .reply(200, groupData);

    const group = await sdk.profiles.groups.removeFieldsFromGroupsProfile(
      profileId,
      groupId,
      {
        fields: ['string'],
      }
    );

    expect(group.groupId).toBe(groupId);
  });
});
