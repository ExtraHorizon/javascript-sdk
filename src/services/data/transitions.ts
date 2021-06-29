import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { CreationTransition, TransitionInput } from './types';

export default (client, httpAuth: HttpInstance) => ({
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
  async updateCreation(
    schemaId: ObjectId,
    requestBody: CreationTransition
  ): Promise<AffectedRecords> {
    return (
      await client.put(httpAuth, `/${schemaId}/creationTransition`, requestBody)
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
  async create(
    schemaId: ObjectId,
    requestBody: TransitionInput
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/${schemaId}/transitions`, requestBody)
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
  async update(
    schemaId: ObjectId,
    transitionId: ObjectId,
    requestBody: TransitionInput
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/transitions/${transitionId}`,
        requestBody
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
  async delete(
    schemaId: ObjectId,
    transitionId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/transitions/${transitionId}`)
    ).data;
  },
});
