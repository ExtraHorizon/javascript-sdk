import { NOTIFICATIONS_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type { AuthHttpClient } from '../../types';
import httpClient from '../http-client';
import health from './health';
import notifications from './notifications';
import settings from './settings';
import { NotificationSettingsServices, NotificationsService } from './types';

export const notificationsService = (
  httpWithAuth: AuthHttpClient
): NotificationsService &
  ReturnType<typeof health> & {
    settings: NotificationSettingsServices;
  } => {
  const client = httpClient({
    basePath: NOTIFICATIONS_BASE,
    transformRequestData: decamelizeRequestData,
  });

  return {
    ...health(client, httpWithAuth),
    ...notifications(client, httpWithAuth),
    settings: settings(client, httpWithAuth),
  };
};
