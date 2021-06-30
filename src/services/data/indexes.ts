import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import { DataIndexesService, Index, IndexInput } from './types';

export default (client, httpAuth: HttpInstance): DataIndexesService => ({
  /**
   * Create an index
   * Set an index on a specific property in a schema.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global`  | **Required** for this endpoint: Create an index
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns Index Success
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {IllegalStateError}
   */
  async create(schemaId: ObjectId, requestBody: IndexInput): Promise<Index> {
    return (await client.post(httpAuth, `/${schemaId}/indexes`, requestBody))
      .data;
  },

  /**
   * Delete an existing index
   * Delete an index for a specific property in a schema.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global`  | **Required** for this endpoint: Delete an index
   * @param indexId The id of the targeted index.
   * @param schemaId The id of the targeted schema.
   * @returns any Success
   * @throws {NoPermissionError}
   * @throws {ResourceUnknownError}
   */
  async delete(
    indexId: ObjectId,
    schemaId: ObjectId
  ): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}/indexes/${indexId}`))
      .data;
  },
});
