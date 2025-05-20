import nock from 'nock';
import { createClient, rqlBuilder } from '../../../src';
import { NOTIFICATIONS_V2_BASE } from '../../../src/constants';
import { notificationV2CreationData, notificationV2Data } from '../../__helpers__/notificationV2';
import { createPagedResponse, randomHexString } from '../../__helpers__/utils';

describe('NotificationsV2 Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const sdk = createClient({
    host,
    clientId: '',
  });

  const notifications = Array(250)
    .fill(null)
    .map(_ => notificationV2Data());

  it('Creates a notification', async () => {
    const notificationId = randomHexString();
    const notification = notificationV2CreationData();

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .post('/')
      .reply(200, { id: notificationId, ...notification });

    const response = await sdk.notificationsV2.create(notification);
    expect(response.id).toBe(notificationId);
  });

  it('Finds notifications', async () => {
    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get('/?limit(250)')
      .reply(200, createPagedResponse(notifications));

    // Prove that we accept RQL
    const rql = rqlBuilder().limit(250).build();

    const response = await sdk.notificationsV2.find({ rql });
    expect(response.page.total).toBe(250);
  });

  it('Finds all notifications', async () => {
    const firstNotificationsPage = notifications.slice(0, 50);
    const secondNotificationsPage = notifications.slice(50, 100);

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get('/?limit(50)')
      .reply(
        200,
        {
          page: {
            total: 100,
            offset: 0,
            limit: 50,
          },
          data: firstNotificationsPage,
        }
      )
      .get('/?limit(50,50)')
      .reply(
        200,
        {
          page: {
            total: 100,
            offset: 50,
            limit: 50,
          },
          data: secondNotificationsPage,
        }
      );

    const response = await sdk.notificationsV2.findAll();
    expect(response).toHaveLength(100);
  });

  it('Finds notifications by targetUserId', async () => {
    const { targetUserId } = notifications[100];

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get(`/?eq(targetUserId,${targetUserId})`)
      .reply(200, createPagedResponse(notifications.filter(notification => notification.targetUserId === targetUserId)));

    const response = await sdk.notificationsV2.findByTargetUserId(targetUserId);
    expect(response.page.total).toBe(1);
  });

  it('Finds the first notification', async () => {
    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get('/')
      .reply(200, createPagedResponse(notifications));

    const response = await sdk.notificationsV2.findFirst();
    expect(response.id).toBe(notifications[0].id);
  });

  it('Finds a notification by id', async () => {
    const { id } = notifications[100];

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get(`/?eq(id,${id})`)
      .reply(200, createPagedResponse(notifications.filter(notification => notification.id === id)));

    const response = await sdk.notificationsV2.findById(id);
    expect(response.id).toBe(id);
  });
});
