import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type {
  CreationTransition,
  DataTransitionsService,
  TransitionInput,
} from './types';

export default (client, httpAuth: HttpInstance): DataTransitionsService => ({
  async updateCreation(
    schemaId: ObjectId,
    requestBody: CreationTransition
  ): Promise<AffectedRecords> {
    return (
      await client.put(httpAuth, `/${schemaId}/creationTransition`, requestBody)
    ).data;
  },

  async create(
    schemaId: ObjectId,
    requestBody: TransitionInput
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpAuth, `/${schemaId}/transitions`, requestBody)
    ).data;
  },

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
  async remove(
    schemaId: ObjectId,
    transitionId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/transitions/${transitionId}`)
    ).data;
  },
});
