import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import notifications from './notifications';
import { NOTIFICATIONS_BASE } from '../../constants';

export type NotificationsService = ReturnType<typeof notifications>;

export const notificationsService = (
  httpWithAuth: HttpInstance
): NotificationsService => {
  const client = httpClient({
    basePath: NOTIFICATIONS_BASE,
  });

  return {
    ...notifications(client, httpWithAuth),
  };
};
