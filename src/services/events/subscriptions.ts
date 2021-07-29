import type { HttpInstance } from '../../types';
import { PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  Subscription,
  CreateSubscription,
  SubscriptionsService,
} from './types';

export default (client, httpAuth: HttpInstance): SubscriptionsService => ({
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Subscription>> {
    return (await client.get(httpAuth, `/subscriptions${options?.rql || ''}`))
      .data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Subscription> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Subscription> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: CreateSubscription): Promise<Subscription> {
    return (await client.post(httpAuth, '/subscriptions', requestBody)).data;
  },
});
