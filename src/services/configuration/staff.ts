import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { UserConfigurationInput } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Update a staff configuration for a group of a user.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   *
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody UserConfigurationInput
   * @returns AffectedRecords
   */
  async updateStaffConfig(
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

  /**
   * Delete fields from a staff configuration for a group of a user.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For staff of the group, update the staff enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   *
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody the list of fields to remove
   * @returns AffectedRecords
   */
  async removeFieldsFromStaffConfig(
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
