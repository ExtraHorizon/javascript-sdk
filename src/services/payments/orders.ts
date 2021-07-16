import type { HttpInstance } from '../../types';
import type { PaymentsOrdersService } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsOrdersService => ({
  async find(options) {
    return (await client.get(httpAuth, `/orders${options?.rql || ''}`, options))
      .data;
  },

  async findById(id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (await client.post(httpAuth, '/orders', requestBody, options)).data;
  },

  async update(orderId, requestBody, options) {
    return (
      await client.put(httpAuth, `/orders/${orderId}`, requestBody, options)
    ).data;
  },

  async addTagsToOrder(rql, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/orders/addTags${rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  async removeTagsFromOrder(rql, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/orders/removeTags${rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },
});
