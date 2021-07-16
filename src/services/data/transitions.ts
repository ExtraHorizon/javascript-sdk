import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataTransitionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataTransitionsService => ({
  /**
   * Update the creation transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  async updateCreation(schemaId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/creationTransition`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Create a transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  async create(schemaId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/transitions`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Update a transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  async update(schemaId, transitionId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/transitions/${transitionId}`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Delete a transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @returns {Promise<AffectedRecords>}
   * @throws {ResourceUnknownError}
   */
  async remove(schemaId, transitionId, options) {
    return (
      await client.delete(
        httpAuth,
        `/${schemaId}/transitions/${transitionId}`,
        options
      )
    ).data;
  },
});
