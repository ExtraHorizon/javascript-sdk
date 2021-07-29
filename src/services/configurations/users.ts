import { RQLString } from '../../rql';

import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type {
  ConfigurationsUsersService,
  UserConfiguration,
  UserConfigurationInput,
} from './types';

export default (
  client,
  httpAuth: HttpInstance
): ConfigurationsUsersService => ({
  async get(userId: ObjectId): Promise<UserConfiguration> {
    return (await client.get(httpAuth, `/users/${userId}`)).data;
  },

  async update(
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },

  async removeFields(
    userId: ObjectId,
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
        `/users/${userId}/deleteFields${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },
});
