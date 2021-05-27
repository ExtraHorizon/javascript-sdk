import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type {
  OrderSchema,
  OrderCreationSchema,
  OrderUpdateSchema,
  UpdateTagsSchema,
} from './types';
import type { RQLString } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Get a list of orders
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List orders created by you
   * `VIEW_STRIPE_ORDERS` | `global` | List orders created by all users
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws ApiError
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<OrderSchema>> {
    return (await client.get(httpAuth, `/orders${options?.rql || ''}`)).data;
  },

  /**
   * Create an order
   * @param requestBody
   * @returns OrderSchema Success
   * @throws ApiError
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
   * @param orderId
   * @param requestBody
   * @returns any Operation successful
   * @throws ApiError
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
   * @param requestBody
   * @returns any Operation successful
   * @throws ApiError
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
   * @param requestBody
   * @returns any Operation successful
   * @throws ApiError
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
