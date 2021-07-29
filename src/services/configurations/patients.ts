import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type {
  ConfigurationsPatientsService,
  UserConfigurationInput,
} from './types';

export default (
  client,
  httpAuth: HttpInstance
): ConfigurationsPatientsService => ({
  async update(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}/patientConfigurations/${groupId}`,
        requestBody
      )
    ).data;
  },

  async removeFields(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/users/${userId}/patientConfigurations/${groupId}/deleteFields`,
        requestBody
      )
    ).data;
  },
});
