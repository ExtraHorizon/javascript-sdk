import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type { Schema, SchemaInput, UpdateSchemaInput } from './types';
import { RQLString } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Create a schema
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Schema successful operation
   * @throws {ApiError}
   */
  async createSchema(requestBody: SchemaInput): Promise<Schema> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Request a list of schemas
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws {ApiError}
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Schema>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Update a schema
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns any Success
   * @throws {ApiError}
   */
  async updateSchema(
    schemaId: ObjectId,
    requestBody: UpdateSchemaInput
  ): Promise<AffectedRecords> {
    return (await client.put(httpAuth, `/${schemaId}`, requestBody)).data;
  },

  /**
   * Delete a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns any Success
   * @throws {IllegalStateError}
   */
  async deleteSchema(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}`)).data;
  },

  /**
   * Disable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns any Success
   * @throws {ApiError}
   */
  async disableSchema(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/disable`)).data;
  },

  /**
   * Enable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns any Success
   * @throws {ApiError}
   */
  async enableSchema(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/enable`)).data;
  },
});
