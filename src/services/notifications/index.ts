import type { AuthHttpClient } from '../../types';
import httpClient from '../http-client';
import { decamelizeKeys } from '../../http/utils';
import notifications from './notifications';
import settings from './settings';
import health from './health';
import { NOTIFICATIONS_BASE } from '../../constants';
import { NotificationSettingsServices, NotificationsService } from './types';

export const notificationsService = (
  httpWithAuth: AuthHttpClient
): NotificationsService &
  ReturnType<typeof health> & {
    settings: NotificationSettingsServices;
  } => {
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
