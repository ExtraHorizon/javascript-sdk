import { NOTIFICATIONS_V2_BASE } from '../../constants';
import { AuthHttpClient } from '../../types';
import httpClient from '../http-client';
import health from './health';
import notificationsV2 from './notificationsV2';
import { NotificationV2Service } from './types';
import notificationV2Users from './users';
import { NotificationV2UserService } from './users/types';

export const notificationsV2Service = (httpWithAuth: AuthHttpClient):
  ReturnType<typeof health> &
  NotificationV2Service &
  { users: NotificationV2UserService; } => {
  const client = httpClient({
    basePath: NOTIFICATIONS_V2_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...notificationsV2(client, httpWithAuth),
    users: notificationV2Users(client, httpWithAuth),
  };
};
