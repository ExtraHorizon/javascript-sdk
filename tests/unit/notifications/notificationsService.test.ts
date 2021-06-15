import nock from 'nock';
import { AUTH_BASE, NOTIFICATIONS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  rqlBuilder,
  ParamsOauth2,
} from '../../../src/index';
import {
  notificationInput,
  notificationData,
  notificationResponse,
  notificationTypesResponse,
} from '../../__helpers__/notification';

describe('Notifications Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const notificationId = notificationData.id;

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

  it('should retrieve a list of your own notifications', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get(`/${rql}`)
      .reply(200, notificationResponse);

    const res = await sdk.notifications.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find your notification by id', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get(`/?eq(id,${notificationId})`)
      .reply(200, notificationResponse);

    const notification = await sdk.notifications.findById(notificationId);

    expect(notification.id).toBe(notificationId);
  });

  it('should find the first notification of the user', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get('/')
      .reply(200, notificationResponse);

    const notification = await sdk.notifications.findFirst();

    expect(notification.id).toBe(notificationId);
  });

  it('should create a new notification', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`).post('/').reply(200, notificationData);

    const notification = await sdk.notifications.create(notificationInput);

    expect(notification.type).toBe(notificationData.type);
  });

  // ggggggggggggg

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
