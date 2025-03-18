import { NOTIFICATIONS_V2_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import { AuthHttpClient } from '../../types';
import httpClient from '../http-client';
import health from './health';
import notificationsV2 from './notificationsV2';
import { NotificationV2Service } from './types';

export const notificationsV2Service = (httpWithAuth: AuthHttpClient): ReturnType<typeof health> & NotificationV2Service => {
  const client = httpClient({
    basePath: NOTIFICATIONS_V2_BASE,
    transformRequestData: decamelizeRequestData,
  });

  return {
    ...health(client, httpWithAuth),
    ...notificationsV2(client, httpWithAuth),
  };
};
