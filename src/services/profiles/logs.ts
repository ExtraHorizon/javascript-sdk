import { RQLString } from '../../rql';
import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  ObjectId,
  PagedResult,
  Results,
  ResultResponse,
} from '../types';
import { LogEntry, ProfileComment, ProfilesLogsService } from './types';

export default (client, httpAuth: HttpInstance): ProfilesLogsService => ({
  async create(
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: ProfileComment
  ): Promise<LogEntry> {
    return (
      await client.post(
        httpAuth,
        `/${profileId}/groups/${groupId}/logs`,
        requestBody
      )
    ).data;
  },

  async find(
    profileId: ObjectId,
    groupId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<LogEntry>> {
    return (
      await client.get(
        httpAuth,
        `/${profileId}/groups/${groupId}/logs${options?.rql || ''}`
      )
    ).data;
  },

  async update(
    profileId: ObjectId,
    groupId: ObjectId,
    entryId: ObjectId,
    requestBody: ProfileComment
  ): Promise<LogEntry> {
    return (
      await client.put(
        httpAuth,
        `/${profileId}/groups/${groupId}/logs/${entryId}`,
        requestBody
      )
    ).data;
  },

  async remove(
    profileId: ObjectId,
    groupId: ObjectId,
    entryId: ObjectId
  ): Promise<AffectedRecords> {
    const result: ResultResponse = await client.delete(
      httpAuth,
      `/${profileId}/groups/${groupId}/logs/${entryId}`
    );
    const affectedRecords = result.status === Results.Success ? 1 : 0;
    return { affectedRecords };
  },
});
