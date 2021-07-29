import type { HttpInstance } from '../../types';
import type { PagedResult } from '../types';
import type {
  PaymentsSubscriptionsService,
  SubscriptionEntitlement,
  SubscriptionEvent,
} from './types';

export default (
  client,
  httpAuth: HttpInstance
): PaymentsSubscriptionsService => ({
  async getEntitlements(): Promise<PagedResult<SubscriptionEntitlement>> {
    return (await client.get(httpAuth, '/subscriptions/entitlements')).data;
  },

  async getEvents(): Promise<PagedResult<SubscriptionEvent>> {
    return (await client.get(httpAuth, '/subscriptions/events')).data;
  },
});
