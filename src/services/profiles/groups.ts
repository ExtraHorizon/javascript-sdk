import type { HttpInstance } from '../../types';
import { AffectedRecords, ObjectId } from '../types';
import { Group, GroupCreation } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Add a group enlistment to a profile
   * Permission | Scope | Effect
   * - | - | -
   * none | | Add a group enlistment for your profile only
   * `ADD_PATIENT` | `staff enlistment` | Add a group enlistment for any profile of this group
   * `ADD_PATIENT` & `ACTIVATE_PRESCRIPTIONS` | `global` | Add a group enlistment for any profile for any group
   *
   * @param profileId Id of the targeted profile
   * @param requestBody Group data
   * @returns Group
   * @throws {ResourceAlreadyExistsError}
   * @throws {ResourceUnknownError}
   */
  async create(
    profileId: ObjectId,
    requestBody: GroupCreation
  ): Promise<Group> {
    return (await client.post(httpAuth, `/${profileId}/groups`, requestBody))
      .data;
  },

  /**
   * Update a group enlistment on a profile
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PROFILES` | `staff enlistment` | Update a group enlistment for any profile for this group
   * `UPDATE_PROFILES` | `global` | Update a group enlistment for any profile for any group
   *
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param requestBody Group data to update
   * @returns Group
   * @throws {ResourceUnknownError}
   */
  async update(
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: Omit<Group, 'groupId'>
  ): Promise<Group> {
    return (
      await client.put(httpAuth, `/${profileId}/groups/${groupId}`, requestBody)
    ).data;
  },

  /**
   * Delete a group from a profile
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete a group from your profile only
   * `UPDATE_PROFILES` | `staff enlistment` | Delete a group from any profile in this group
   * `UPDATE_PROFILES` | `global` | Delete a group from any profile in any group
   *
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async remove(
    profileId: ObjectId,
    groupId: ObjectId
  ): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${profileId}/groups/${groupId}`))
      .data;
  },

  /**
   * Remove a field on a group enlistment object in a profile
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PROFILES` | `staff enlistment` | Remove a field for this group
   * `UPDATE_PROFILES` | `global` | Remove a field for any group
   *
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param requestBody list of fields to remove
   * @returns Group
   * @throws {ResourceUnknownError}
   */
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
