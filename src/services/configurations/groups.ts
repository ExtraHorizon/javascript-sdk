import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type {
  GroupConfigurationInput,
  GroupConfiguration,
  ConfigurationsGroupsService,
} from './types';
import type { RQLString } from '../../rql';

export default (
  client,
  httpAuth: HttpInstance
): ConfigurationsGroupsService => ({
  async get(groupId: ObjectId): Promise<GroupConfiguration> {
    return (await client.get(httpAuth, `/groups/${groupId}`)).data;
  },

  async update(
    groupId: ObjectId,
    requestBody: GroupConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/groups/${groupId}${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },

  async removeFields(
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/groups/${groupId}/deleteFields${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },
});
