import type { HttpInstance } from '../../types';
import type { ObjectId } from '../models/ObjectId';
import type { AffectedRecords } from '../models/Responses';
import { Transition, CreationTransition } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Update the creation transition
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns any Success
   * @throws {400Error}
   */
  async updateCreationTransition(
    schemaId: ObjectId,
    requestBody?: CreationTransition
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
   * @returns any Success
   * @throws {400Error}
   */
  async createTransition(
    schemaId: ObjectId,
    requestBody?: Transition
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
   * @returns any Success
   * @throws {400Error}
   * @throws {404Error}
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
   * @returns any Success
   * @throws {404Error}
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
