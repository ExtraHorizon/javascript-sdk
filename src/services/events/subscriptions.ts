import type { HttpInstance } from '../../types';
import { rqlBuilder } from '../../rql';
import type { SubscriptionsService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): SubscriptionsService => ({
  async find(options) {
    return (await client.get(httpAuth, `/subscriptions${options?.rql || ''}`))
      .data;
  },

  async findById(this: SubscriptionsService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: SubscriptionsService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (await client.post(httpAuth, '/subscriptions', requestBody, options))
      .data;
  },
});
