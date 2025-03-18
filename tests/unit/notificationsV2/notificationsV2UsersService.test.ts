import nock from 'nock';
import { createClient, rqlBuilder } from '../../../src';
import { NOTIFICATIONS_V2_BASE } from '../../../src/constants';
import { notificationV2UserCreationData, notificationV2UserData } from '../../__helpers__/notificationV2';
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

  it('Creates a user', async () => {
    const userId = randomHexString();
    const userCreationData = notificationV2UserCreationData();

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .put(`/users/${userId}`)
      .reply(200, { id: userId, ...userCreationData });

    const response = await sdk.notificationsV2.users.create(userId, userCreationData);
    expect(response.id).toBe(userId);
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

  it('Finds a user by id', async () => {
    const { id } = users[100];

    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get(`/users/?eq(id,${id})`)
      .reply(200, createPagedResponse(users.filter(user => user.id === id)));

    const response = await sdk.notificationsV2.users.findByUserId(id);
    expect(response.id).toBe(id);
  });

  it('Finds the first user', async () => {
    nock(`${host}${NOTIFICATIONS_V2_BASE}`)
      .get('/users/')
      .reply(200, createPagedResponse(users));

    const response = await sdk.notificationsV2.users.findFirst();
    expect(response.id).toBe(users[0].id);
  });
});
