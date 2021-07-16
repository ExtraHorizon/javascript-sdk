import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ActionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ActionsService => ({
  /**
   * Add an action to the dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param requestBody ActionCreation
   * @returns Action
   */
  async create(dispatcherId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${dispatcherId}/actions`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Update an action for the specified dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param actionId The id of the targeted action
   * @param requestBody ActionUpdate
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async update(dispatcherId, actionId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${dispatcherId}/actions/${actionId}`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Delete an action from the specified dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param actionId The id of the targeted action
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async remove(dispatcherId, actionId, options) {
    return (
      await client.delete(
        httpAuth,
        `/${dispatcherId}/actions/${actionId}`,
        options
      )
    ).data;
  },
});
