import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type {
  ProductSchema,
  ProductCreationSchema,
  UpdateTagsSchema,
} from './types';
import { RQLString, rqlBuilder } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Create a product
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns ProductSchema
   */
  async create(requestBody: ProductCreationSchema): Promise<ProductSchema> {
    return (await client.post(httpAuth, '/products', requestBody)).data;
  },

  /**
   * Get a list of products
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<ProductSchema>
   */
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<ProductSchema>> {
    return (await client.get(httpAuth, `/products${options?.rql || ''}`)).data;
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
  ): Promise<ProductSchema> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<ProductSchema> {
    const res = await this.find(options);
    return res.data[0];
  },

  /**
   * Add Tags to a Product
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  async addTagsToProduct(
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/products/addTags${rql || ''}`, requestBody)
    ).data;
  },

  /**
   * Remove tags from a Product
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  async removeTagsFromProduct(
    rql: string,
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

  /**
   * Update a product
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   *
   * @param productId ID of the Product
   * @param requestBody ProductCreationSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async update(
    productId: ObjectId,
    requestBody: ProductCreationSchema
  ): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/products/${productId}`, requestBody))
      .data;
  },

  /**
   * Delete a product
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   *
   * @param productId ID of the Product
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async remove(productId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/products/${productId}`)).data;
  },
});
