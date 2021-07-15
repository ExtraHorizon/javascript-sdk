import type { HttpInstance } from '../../types';
import type { PagedResult } from '../types';
import { addPagers } from '../utils';
import type {
  PaymentsSubscriptionsService,
  SubscriptionEntitlement,
  SubscriptionEvent,
} from './types';

export default (
  client,
  httpAuth: HttpInstance
): PaymentsSubscriptionsService => ({
  /**
   * Get a list of subscription entitlements
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List entitlements related to you
   * `VIEW_SUBSCRIPTION_ENTITLEMENTS` | `global` | List entitlements related to all users
   *
   * @returns PagedResult<SubscriptionEntitlement>
   */
  async getEntitlements(): Promise<PagedResult<SubscriptionEntitlement>> {
    const result = (await client.get(httpAuth, '/subscriptions/entitlements'))
      .data;
    return addPagers.call(this, [], {}, result);
  },

  /**
   * Get a list of subscription events
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List events related to you
   * `VIEW_SUBSCRIPTION_EVENTS` | `global` | List events related to all users
   *
   * @returns PagedResult<SubscriptionEvent>
   */
  async getEvents(): Promise<PagedResult<SubscriptionEvent>> {
    const result = (await client.get(httpAuth, '/subscriptions/events')).data;
    return addPagers.call(this, [], {}, result);
  },
});
