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
  /**
   * Get a list of orders
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List orders created by you
   * `VIEW_STRIPE_ORDERS` | `global` | List orders created by all users
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<OrderSchema>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<OrderSchema>> {
    return (await client.get(httpAuth, `/orders${options?.rql || ''}`)).data;
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
  ): Promise<OrderSchema> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<OrderSchema> {
    const res = await this.find(options);
    return res.data[0];
  },

  /**
   * Create an order
   * @param requestBody
   * @returns OrderSchema
   * @throws {ResourceAlreadyExistsError}
   * @throws {InvalidCurrencyForProductPrice}
   */
  async create(requestBody: OrderCreationSchema): Promise<OrderSchema> {
    return (await client.post(httpAuth, '/orders', requestBody)).data;
  },

  /**
   * Update the status of an order
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_ORDERS` | `global` | **Required** for this endpoint
   *
   * @param orderId The order Id
   * @param requestBody OrderUpdateSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async update(
    orderId: ObjectId,
    requestBody: OrderUpdateSchema
  ): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/orders/${orderId}`, requestBody)).data;
  },

  /**
   * Add Tags to an Order
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_ORDERS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  async addTagsToOrder(
    rql: string,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/orders/addTags${rql || ''}`, requestBody)
    ).data;
  },

  /**
   * Remove Tags from an Order
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_ORDERS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  async removeTagsFromOrder(
    rql: string,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/orders/removeTags${rql || ''}`, requestBody)
    ).data;
  },
});
