import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataPropertiesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataPropertiesService => ({
  /**
   * Create a property
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody The name and configuration
   * @returns AffectedRecords
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {IllegalStateException}
   * @throws {ResourceUnknownException}
   */
  async create(schemaId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/properties`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Delete a property
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param propertyPath The path to the property
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  async remove(schemaId, propertyPath, options) {
    return (
      await client.delete(
        httpAuth,
        `/${schemaId}/properties/${propertyPath}`,
        options
      )
    ).data;
  },

  /**
   * Update a property
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param propertyPath The path to the property
   * @param requestBody The configuration
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  async update(schemaId, propertyPath, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/properties/${propertyPath}`,
        requestBody,
        options
      )
    ).data;
  },
});
