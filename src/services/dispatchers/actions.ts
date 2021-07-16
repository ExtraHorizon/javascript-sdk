import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type {
  Action,
  ActionCreation,
  ActionUpdate,
  ActionsService,
} from './types';

export default (client, httpAuth: HttpInstance): ActionsService => ({
  async create(
    dispatcherId: ObjectId,
    requestBody: ActionCreation
  ): Promise<Action> {
    return (
      await client.post(httpAuth, `/${dispatcherId}/actions`, requestBody)
    ).data;
  },

  async update(
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

  async remove(
    dispatcherId: ObjectId,
    actionId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${dispatcherId}/actions/${actionId}`)
    ).data;
  },
});
