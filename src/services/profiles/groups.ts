import type { HttpInstance } from '../../types';
import { AffectedRecords, ObjectId } from '../types';
import { Group, GroupCreation, ProfilesGroupsService } from './types';

export default (client, httpAuth: HttpInstance): ProfilesGroupsService => ({
  async create(
    profileId: ObjectId,
    requestBody: GroupCreation
  ): Promise<Group> {
    return (await client.post(httpAuth, `/${profileId}/groups`, requestBody))
      .data;
  },

  async update(
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: Omit<Group, 'groupId'>
  ): Promise<Group> {
    return (
      await client.put(httpAuth, `/${profileId}/groups/${groupId}`, requestBody)
    ).data;
  },

  async remove(
    profileId: ObjectId,
    groupId: ObjectId
  ): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${profileId}/groups/${groupId}`))
      .data;
  },

  async removeFields(
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<Group> {
    return (
      await client.post(
        httpAuth,
        `/${profileId}/groups/${groupId}/remove_fields`,
        requestBody
      )
    ).data;
  },
});
