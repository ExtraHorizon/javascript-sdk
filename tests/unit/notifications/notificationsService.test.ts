import nock from 'nock';
import {AUTH_BASE, NOTIFICATIONS_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client, rqlBuilder,} from '../../../src/index';
import {notificationData, notificationInput, notificationTypeData,} from '../../__helpers__/notification';
import {createPagedResponse} from '../../__helpers__/utils';

describe('Notifications Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const notificationId = notificationData.id;
  const notificationResponse = createPagedResponse(notificationData);
  const notificationTypesResponse = createPagedResponse(notificationTypeData);

  let sdk: OAuth2Client;

  beforeAll(async () => {
    sdk = createOAuth2Client({
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

  it('should create a new notification', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`).post('/').reply(200, notificationData);

    const notification = await sdk.notifications.create(notificationInput);

    expect(notification.type).toBe(notificationData.type);
  });

  it('should find a notification', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get('/notifications')
      .reply(200, notificationResponse);

    const res = await sdk.notifications.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find all notifications', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get('/notifications?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(notificationData),
      })
      .get('/notifications?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(notificationData),
      });

    const res = await sdk.notifications.findAll({ rql });

    expect(res.length).toBeGreaterThan(0);
  });

  it('should request a list of all notifications via iterator', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get('/notifications?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(notificationData),
      })
      .get('/notifications?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(notificationData),
      });
    const notifications = sdk.notifications.findAllIterator();

    await notifications.next();
    const thirdPage = await notifications.next();
    expect(thirdPage.value.data.length).toBe(5);
  });

  it('should find a notification by id', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get(`/notifications?eq(id,${notificationId})`)
      .reply(200, notificationResponse);

    const notification = await sdk.notifications.findById(notificationId);

    expect(notification.id).toBe(notificationId);
  });

  it('should find the first notification', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get('/notifications')
      .reply(200, notificationResponse);

    const notification = await sdk.notifications.findFirst();

    expect(notification.id).toBe(notificationId);
  });

  it('should delete a notification', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .delete(`/notifications`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.notifications.remove();

    expect(res.affectedRecords).toBe(1);
  });

  it('should mark your notification(s) as viewed', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .post(`/viewed`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.notifications.markAsViewed();

    expect(res.affectedRecords).toBe(1);
  });

  it('should retrieve the list of notification types', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get(`/types`)
      .reply(200, notificationTypesResponse);

    const res = await sdk.notifications.getTypes();

    expect(res.data.length).toBeGreaterThan(0);
  });
});
