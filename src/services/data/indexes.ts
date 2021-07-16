import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import { DataIndexesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataIndexesService => ({
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
  async create(schemaId, requestBody, options) {
    return (
      await client.post(httpAuth, `/${schemaId}/indexes`, requestBody, options)
    ).data;
  },

  /**
   * Delete an existing index
   * Delete an index for a specific property in a schema.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global`  | **Required** for this endpoint: Delete an index
   * @param indexId The id of the targeted index.
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   * @throws {NoPermissionError}
   * @throws {ResourceUnknownError}
   */
  async remove(indexId, schemaId, options) {
    return (
      await client.delete(httpAuth, `/${schemaId}/indexes/${indexId}`, options)
    ).data;
  },
});
