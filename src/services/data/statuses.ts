import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataStatusesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataStatusesService => ({
  /**
   * Create a status
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody The name and status data
   * @returns AffectedRecords
   * @throws {ResourceAlreadyExistsError}
   */
  async create(schemaId, requestBody, options) {
    return (
      await client.post(httpAuth, `/${schemaId}/statuses`, requestBody, options)
    ).data;
  },

  /**
   * Update a status
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param name The name of the targeted status.
   * @param requestBody The status data
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async update(schemaId, name, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/statuses/${name}`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Delete a status
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param name The name of the targeted status.
   * @returns AffectedRecords
   * @throws {StatusInUseError}
   * @throws {ResourceUnknownError}
   */
  async remove(schemaId, name, options) {
    return (
      await client.delete(httpAuth, `/${schemaId}/statuses/${name}`, options)
    ).data;
  },
});
