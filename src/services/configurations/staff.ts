import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type {
  ConfigurationsStaffService,
  UserConfigurationInput,
} from './types';

export default (
  client,
  httpAuth: HttpInstance
): ConfigurationsStaffService => ({
  async update(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfigurationInput
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}/staffConfigurations/${groupId}`,
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
        `/users/${userId}/staffConfigurations/${groupId}/deleteFields`,
        requestBody
      )
    ).data;
  },
});
