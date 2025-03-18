import nock from 'nock';
import { createClient } from '../../../src';
import { NOTIFICATIONS_V2_BASE } from '../../../src/constants';
import { notificationV2UserCreationData } from '../../__helpers__/notificationV2';
import { randomHexString } from '../../__helpers__/utils';

describe('NotificationsV2 Users Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const sdk = createClient({
    host,
    clientId: '',
  });

  it('Creates a user', async () => {
    const userId = randomHexString();
    const user = notificationV2UserCreationData();

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .put(`/users/${userId}`)
      .reply(200, { id: userId, ...user });

    const response = await sdk.notificationsV2.users.create(userId, user);
    expect(response.id).toBe(userId);
  });
});
