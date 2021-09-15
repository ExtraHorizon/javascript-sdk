import type { HttpInstance } from '../../types';
import type { PaymentsOrdersService, OrderSchema } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsOrdersService => ({
  async find(options) {
    return (await client.get(httpAuth, `/orders${options?.rql || ''}`, options))
      .data;
  },

  async findAll(options) {
    return findAllGeneric<OrderSchema>(this.find, options);
  },

  findAllIterator(options) {
    return findAllIterator<OrderSchema>(this.find, options);
  },

  async findById(this: PaymentsOrdersService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: PaymentsOrdersService, options) {
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
