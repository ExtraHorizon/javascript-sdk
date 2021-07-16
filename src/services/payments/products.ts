import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type {
  ProductSchema,
  ProductCreationSchema,
  UpdateTagsSchema,
  PaymentsProductsService,
} from './types';
import { RQLString, rqlBuilder } from '../../rql';

export default (client, httpAuth: HttpInstance): PaymentsProductsService => ({
  async create(requestBody: ProductCreationSchema): Promise<ProductSchema> {
    return (await client.post(httpAuth, '/products', requestBody)).data;
  },

  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<ProductSchema>> {
    return (await client.get(httpAuth, `/products${options?.rql || ''}`)).data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<ProductSchema> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<ProductSchema> {
    const res = await this.find(options);
    return res.data[0];
  },

  async addTagsToProduct(
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/products/addTags${rql || ''}`, requestBody)
    ).data;
  },

  async removeTagsFromProduct(
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/products/removeTags${rql || ''}`,
        requestBody
      )
    ).data;
  },

  async update(
    productId: ObjectId,
    requestBody: ProductCreationSchema
  ): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/products/${productId}`, requestBody))
      .data;
  },

  async remove(productId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/products/${productId}`)).data;
  },
});
