import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { UserConfiguration } from './types';

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
   * @param requestBody
   * @returns any Operation successful
   */
  async updatePatientConfig(
    groupId: ObjectId,
    userId: ObjectId,
    requestBody: UserConfiguration
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
   * @param requestBody
   * @returns any Operation successful
   */
  async removeFieldsFromPatientConfig(
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
