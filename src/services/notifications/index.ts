import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import { decamelizeKeys } from '../../http/utils';
import notifications from './notifications';
import settings from './settings';
import health from './health';
import { NOTIFICATIONS_BASE } from '../../constants';

export type NotificationsService = ReturnType<typeof notifications> &
  ReturnType<typeof health> & {
    settings: ReturnType<typeof settings>;
  };

export const notificationsService = (
  httpWithAuth: HttpInstance
): NotificationsService => {
  const client = httpClient({
    basePath: NOTIFICATIONS_BASE,
    transformRequestData: decamelizeKeys,
  });

  return {
    ...health(client, httpWithAuth),
    ...notifications(client, httpWithAuth),
    settings: settings(client, httpWithAuth),
  };
};
