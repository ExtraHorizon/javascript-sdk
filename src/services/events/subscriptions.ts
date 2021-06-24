import type { HttpInstance } from '../../types';
import { PagedResult } from '../types';
import { RQLString } from '../../rql';
import type { Subscription, CreateSubscriptionBean } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Returns a list of event subscriptions
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Subscription>
   */
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Subscription>> {
    return (await client.get(httpAuth, `/subscriptions${options?.rql || ''}`))
      .data;
  },

  /**
   * Creates an event subscription
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns Subscription
   */
  async create(requestBody: CreateSubscriptionBean): Promise<Subscription> {
    return (await client.post(httpAuth, '/subscriptions', requestBody)).data;
  },
});
