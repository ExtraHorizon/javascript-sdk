import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ConfigurationsPatientsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsPatientsService => ({
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
  async update(groupId, userId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}/patientConfigurations/${groupId}`,
        requestBody,
        options
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
  async removeFields(groupId, userId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/users/${userId}/patientConfigurations/${groupId}/deleteFields`,
        requestBody,
        options
      )
    ).data;
  },
});
