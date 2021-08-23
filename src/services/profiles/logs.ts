import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import { Results, ResultResponse } from '../types';
import { ProfilesLogsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ProfilesLogsService => ({
  async create(profileId, groupId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${profileId}/groups/${groupId}/logs`,
        requestBody,
        options
      )
    ).data;
  },

  async find(profileId, groupId, options?) {
    return (
      await client.get(
        httpAuth,
        `/${profileId}/groups/${groupId}/logs${options?.rql || ''}`,
        options
      )
    ).data;
  },

  async update(profileId, groupId, entryId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${profileId}/groups/${groupId}/logs/${entryId}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(profileId, groupId, entryId, options) {
    const result: ResultResponse = await client.delete(
      httpAuth,
      `/${profileId}/groups/${groupId}/logs/${entryId}`,
      options
    );
    const affectedRecords = result.status === Results.Success ? 1 : 0;
    return { affectedRecords };
  },
});
