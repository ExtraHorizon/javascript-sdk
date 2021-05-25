import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { Action, ActionCreation, ActionUpdate } from './types';
// import type { RQLString } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Add an action to the dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param requestBody
   * @returns Action Success
   * @throws ApiError
   */
  async createAction(
    dispatcherId: ObjectId,
    requestBody: ActionCreation
  ): Promise<Action> {
    return (
      await client.post(httpAuth, `/${dispatcherId}/actions`, requestBody)
    ).data;
  },

  /**
   * Update an action for the specified dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param actionId The id of the targeted action
   * @param requestBody
   * @returns any Operation successful
   * @throws ApiError
   */
  async updateAction(
    dispatcherId: ObjectId,
    actionId: ObjectId,
    requestBody: ActionUpdate
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${dispatcherId}/actions/${actionId}`,
        requestBody
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
   * @returns any Operation successful
   * @throws ApiError
   */
  async deleteAction(
    dispatcherId: ObjectId,
    actionId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${dispatcherId}/actions/${actionId}`)
    ).data;
  },
});
