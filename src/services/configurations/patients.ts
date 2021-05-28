import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { UserConfigurationInput } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Update a patient configuration for a group of a user.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   *
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody UserConfigurationInput
   * @returns AffectedRecords
   */
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

  /**
   * Delete fields from a patient configuration for a group of a user.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | For patients of the group, update the patient enlistment configuration of the group
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user its staff configuration
   *
   * @param groupId The id of the targeted group
   * @param userId The id of the targeted user
   * @param requestBody the list of fields to remove
   * @returns AffectedRecords
   */
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
