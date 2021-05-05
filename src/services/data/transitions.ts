import type { HttpInstance } from '../../types';
import type { ObjectId } from '../models/ObjectId';
import type { AffectedRecords } from '../models/Responses';
import { Transition, CreationTransition, TransitionInput } from './types';

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
  async updateCreationTransition(
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
  async createTransition(
    schemaId: ObjectId,
    requestBody: Transition
  ): Promise<TransitionInput> {
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
  async updateTransition(
    schemaId: ObjectId,
    transitionId: ObjectId,
    requestBody: Transition
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
  async deleteTransition(
    schemaId: ObjectId,
    transitionId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/transitions/${transitionId}`)
    ).data;
  },
});
