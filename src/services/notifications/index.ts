import { NOTIFICATIONS_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type { AuthHttpClient } from '../../types';
import httpClient from '../http-client';
import notifications from './notifications';
import settings from './settings';
import { NotificationSettingsServices, NotificationsService } from './types';

export const notificationsService = (
  httpWithAuth: AuthHttpClient
): NotificationsService &{
    settings: NotificationSettingsServices;
  } => {
  const client = httpClient({
    basePath: NOTIFICATIONS_BASE,
    transformRequestData: decamelizeRequestData,
  });

  return {
    ...notifications(client, httpWithAuth),
    settings: settings(client, httpWithAuth),
  };
};
