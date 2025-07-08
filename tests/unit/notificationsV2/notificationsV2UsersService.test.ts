import nock from 'nock';
import { createClient, rqlBuilder } from '../../../src';
import { NOTIFICATIONS_V2_BASE } from '../../../src/constants';
import { notificationV2UserUpdateData, notificationV2UserData } from '../../__helpers__/notificationV2';
import { createPagedResponse, randomHexString } from '../../__helpers__/utils';

describe('NotificationsV2 Users Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const sdk = createClient({
    host,
    clientId: '',
  });

  const users = Array(250)
    .fill(null)
    .map(_ => notificationV2UserData());

  it('Updates a user', async () => {
    const userId = randomHexString();
    const data = notificationV2UserUpdateData();

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .put(`/users/${userId}`, { ...data })
      .reply(200, { affectedRecords: 1 });

    const response = await sdk.notificationsV2.users.update(userId, data);
    expect(response).toStrictEqual({ affectedRecords: 1 });
  });

  it('Finds users', async () => {
    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get('/users/?limit(250)')
      .reply(200, createPagedResponse(users));

    // Prove that we accept RQL
    const rql = rqlBuilder().limit(250).build();

    const response = await sdk.notificationsV2.users.find({ rql });
    expect(response.page.total).toBe(250);
  });

  it('Finds all users', async () => {
    const firstUsersPage = users.slice(0, 50);
    const secondUsersPage = users.slice(50, 100);

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get('/users/?limit(50)')
      .reply(
        200,
        {
          page: {
            total: 100,
            offset: 0,
            limit: 50,
          },
          data: firstUsersPage,
        }
      )
      .get('/users/?limit(50,50)')
      .reply(
        200,
        {
          page: {
            total: 100,
            offset: 50,
            limit: 50,
          },
          data: secondUsersPage,
        }
      );

    const response = await sdk.notificationsV2.users.findAll();
    expect(response).toHaveLength(100);
  });

  it('Finds the first user', async () => {
    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get('/users/')
      .reply(200, createPagedResponse(users));

    const response = await sdk.notificationsV2.users.findFirst();
    expect(response?.id).toBe(users[0].id);
  });

  it('Gets the notification settings for a specific user', async () => {
    const userSetting = notificationV2UserData();
    const responseBody = {
      ...userSetting,
      creationTimestamp: userSetting.creationTimestamp.toISOString(),
      updateTimestamp: userSetting.updateTimestamp.toISOString(),
    };

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get(`/users/${userSetting.id}`)
      .reply(200, responseBody);

    const response = await sdk.notificationsV2.users.getById(userSetting.id);
    expect(response).toStrictEqual(userSetting);
  });

  it('Deletes the notification settings for a specific user', async () => {
    const userId = randomHexString();

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .delete(`/users/${userId}`)
      .reply(200, { affectedRecords: 1 });

    const response = await sdk.notificationsV2.users.remove(userId);
    expect(response).toStrictEqual({ affectedRecords: 1 });
  });

  it('Adds or updates a device to a user its notification settings', async () => {
    const userId = randomHexString();
    const deviceName = 'test-device';
    const deviceData = {
      description: 'Test Device',
      fcmToken: 'test-fcm-token',
    };

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .put(`/users/${userId}/devices/${deviceName}`, deviceData)
      .reply(200, { affectedRecords: 1 });

    const response = await sdk.notificationsV2.users.addOrUpdateDevice(userId, deviceName, deviceData);
    expect(response).toStrictEqual({ affectedRecords: 1 });
  });

  it('Removes a device from a user its notification settings', async () => {
    const userId = randomHexString();
    const deviceName = 'test-device';

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .delete(`/users/${userId}/devices/${deviceName}`)
      .reply(200, { affectedRecords: 1 });

    const response = await sdk.notificationsV2.users.removeDevice(userId, deviceName);
    expect(response).toStrictEqual({ affectedRecords: 1 });
  });
});
