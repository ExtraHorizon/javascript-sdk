import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type { Schema, SchemaInput, UpdateSchemaInput } from './types';
import { RQLString } from '../../rql';

const addTransitionByNameSchema = (schema: Schema) => ({
  ...schema,
  transitionByName(name: string) {
    return this.transitions.find(transition => transition.name === name);
  },
});

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Create a schema
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Schema successful operation
   */
  async create(requestBody: SchemaInput): Promise<Schema> {
    return addTransitionByNameSchema(
      (await client.post(httpAuth, '/', requestBody)).data
    );
  },

  /**
   * Request a list of schemas
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @param rql Add filters to the requested list.
   * @returns any Success
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Schema>> {
    const result = (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
    return {
      ...result,
      data: result.data.map(addTransitionByNameSchema),
    };
  },

  /**
   * Update a schema
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns any Success
   */
  async update(
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
  async delete(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}`)).data;
  },

  /**
   * Disable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns any Success
   */
  async disable(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/disable`)).data;
  },

  /**
   * Enable a schema
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns any Success
   */
  async enable(schemaId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/enable`)).data;
  },
});
