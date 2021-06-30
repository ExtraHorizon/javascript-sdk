import type { HttpInstance } from '../../types';
import { PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  Subscription,
  CreateSubscription,
  SubscriptionsService,
} from './types';

export default (client, httpAuth: HttpInstance): SubscriptionsService => ({
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
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Subscription> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<Subscription> {
    const res = await this.find(options);
    return res.data[0];
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
  async create(requestBody: CreateSubscription): Promise<Subscription> {
    return (await client.post(httpAuth, '/subscriptions', requestBody)).data;
  },
});