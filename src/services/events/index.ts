import { EVENTS_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type {
  EventsService,
  HttpInstance,
  SubscriptionsService,
} from '../../types';
import httpClient from '../http-client';
import events from './events';
import health from './health';
import subscriptions from './subscriptions';

export const eventsService = (
  httpWithAuth: HttpInstance
): ReturnType<typeof health> &
  EventsService & { subscriptions: SubscriptionsService } => {
  const client = httpClient({
    basePath: EVENTS_BASE,
    transformRequestData: decamelizeRequestData,
  });

  return {
    ...health(client, httpWithAuth),
    ...events(client, httpWithAuth),
    subscriptions: subscriptions(client, httpWithAuth),
  };
};
