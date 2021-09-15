import type { HttpInstance } from '../../types';
import type { PaymentsProductsService, ProductSchema } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsProductsService => {
  async function find(options) {
    return (
      await client.get(httpAuth, `/products${options?.rql || ''}`, options)
    ).data;
  }

  return {
    async create(requestBody, options) {
      return (await client.post(httpAuth, '/products', requestBody, options))
        .data;
    },

    find,

    async findAll(options) {
      return findAllGeneric<ProductSchema>(find, options);
    },

    findAllIterator(options) {
      return findAllIterator<ProductSchema>(find, options);
    },

    async findById(this: PaymentsProductsService, id, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
      const res = await find({ ...options, rql: rqlWithId });
      return res.data[0];
    },

    async findFirst(this: PaymentsProductsService, options) {
      const res = await find(options);
      return res.data[0];
    },

    async addTagsToProduct(rql, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/products/addTags${rql || ''}`,
          requestBody,
          options
        )
      ).data;
    },

    async removeTagsFromProduct(rql, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/products/removeTags${rql || ''}`,
          requestBody,
          options
        )
      ).data;
    },

    async update(productId, requestBody, options) {
      return (
        await client.put(
          httpAuth,
          `/products/${productId}`,
          requestBody,
          options
        )
      ).data;
    },

    async remove(productId, options) {
      return (await client.delete(httpAuth, `/products/${productId}`, options))
        .data;
    },
  };
};
