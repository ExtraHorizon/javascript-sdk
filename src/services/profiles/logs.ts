import { RQLString } from '../../rql';
import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  ObjectId,
  Results,
  ResultResponse,
  PagedResult,
} from '../types';
import { addPagers } from '../utils';
import { LogEntry, ProfileComment, ProfilesLogsService } from './types';

export default (client, httpAuth: HttpInstance): ProfilesLogsService => ({
  /**
   * Create a profile log entry
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_PROFILE_LOG_ENTRIES` | `staff enlistment` | Create a log entry for any profile of this group
   * `CREATE_PROFILE_LOG_ENTRIES` | `global` | Create a log entry for any profile of any group
   *
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param requestBody ProfileComment
   * @returns LogEntry
   * @throws {ResourceUnknownError}
   */
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

  /**
   * Retrieve all profile log entries
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_PROFILE_LOG_ENTRIES` | `staff enlistment` | Retrieve a list of log entries for any profile of this group
   * `VIEW_PROFILE_LOG_ENTRIES` | `global` | Retrieve a list of log entries for any profile of any group
   *
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @returns PagedResult<LogEntry>
   * @throws {ResourceUnknownError}
   */
  async find(
    profileId: ObjectId,
    groupId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<LogEntry>> {
    const result = (
      await client.get(
        httpAuth,
        `/${profileId}/groups/${groupId}/logs${options?.rql || ''}`
      )
    ).data;
    return addPagers.call(this, [profileId, groupId], options, result);
  },

  /**
   * Update a profile log entry
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_PROFILE_LOG_ENTRIES` | `staff enlistment` | Update a log entry, created by the current user, for any profile of this group
   * `CREATE_PROFILE_LOG_ENTRIES` | `global` | Update a log entry, created by the current user, for any profile of any group
   *
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param entryId Id of the targeted log entry
   * @param requestBody ProfileComment
   * @returns LogEntry
   * @throws {ResourceUnknownError}
   */
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

  /**
   * Delete a profile log entry
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_PROFILE_LOG_ENTRIES` | `staff enlistment` | Delete a log entry, created by the current user, for any profile of this group
   * `CREATE_PROFILE_LOG_ENTRIES` | `global` | Delete a log entry, created by the current user, for any profile of any group
   *
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param entryId Id of the targeted log entry
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
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
