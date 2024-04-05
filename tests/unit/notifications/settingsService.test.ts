import nock from 'nock';
import { AUTH_BASE, NOTIFICATIONS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  rqlBuilder,
  ParamsOauth2,
} from '../../../src/index';
import {
  notificationData,
  settingsInput,
  settingsData,
} from '../../__helpers__/notification';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Settings Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const notificationId = notificationData.id;
  const settingsId = settingsData.id;
  const settingsResponse = createPagedResponse(settingsData);

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

  it('should retrieve a list of notifications settings', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get(`/settings${rql}`)
      .reply(200, settingsResponse);

    const res = await sdk.notifications.settings.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find settings by id', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get(`/settings?eq(id,${settingsId})`)
      .reply(200, settingsResponse);

    const settings = await sdk.notifications.settings.findById(notificationId);

    expect(settings.id).toBe(settingsId);
  });

  it('should find the first settings', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .get('/settings')
      .reply(200, settingsResponse);

    const settings = await sdk.notifications.settings.findFirst();

    expect(settings.id).toBe(settingsId);
  });

  it('should update the notification settings for a user', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .put(`/settings/${notificationData.userId}`)
      .reply(200, settingsData);

    const settings = await sdk.notifications.settings.update(
      notificationData.userId,
      settingsInput
    );

    expect(settings.id).toBe(settingsId);
  });

  it('should delete the notifications settings for a user', async () => {
    nock(`${host}${NOTIFICATIONS_BASE}`)
      .delete(`/settings/${notificationData.userId}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.notifications.settings.remove(
      notificationData.userId
    );

    expect(res.affectedRecords).toBe(1);
  });
});
