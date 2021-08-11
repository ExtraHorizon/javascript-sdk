import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { PaymentsSubscriptionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsSubscriptionsService => ({
  async getEntitlements(options) {
    return (await client.get(httpAuth, '/subscriptions/entitlements', options))
      .data;
  },

  async getEvents(options) {
    return (await client.get(httpAuth, '/subscriptions/events', options)).data;
  },
});
