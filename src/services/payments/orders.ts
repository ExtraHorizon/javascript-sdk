import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type {
  OrderSchema,
  OrderCreationSchema,
  OrderUpdateSchema,
  UpdateTagsSchema,
  PaymentsOrdersService,
} from './types';
import { RQLString, rqlBuilder } from '../../rql';

export default (client, httpAuth: HttpInstance): PaymentsOrdersService => ({
  async find(options?: { rql?: RQLString }): Promise<PagedResult<OrderSchema>> {
    return (await client.get(httpAuth, `/orders${options?.rql || ''}`)).data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<OrderSchema> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<OrderSchema> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: OrderCreationSchema): Promise<OrderSchema> {
    return (await client.post(httpAuth, '/orders', requestBody)).data;
  },

  async update(
    orderId: ObjectId,
    requestBody: OrderUpdateSchema
  ): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/orders/${orderId}`, requestBody)).data;
  },

  async addTagsToOrder(
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/orders/addTags${rql || ''}`, requestBody)
    ).data;
  },

  async removeTagsFromOrder(
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/orders/removeTags${rql || ''}`, requestBody)
    ).data;
  },
});
