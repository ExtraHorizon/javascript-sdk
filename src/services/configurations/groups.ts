import type { HttpInstance } from '../../types';
import type { ConfigurationsGroupsService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsGroupsService => ({
  /**
   * View a group configuration
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_PATIENT_CONFIGURATIONS` | `staff enlistment` | View the group its patient configuration
   * `VIEW_STAFF_CONFIGURATIONS` | `staff enlistment` | View the group its staff configuration
   * `VIEW_CONFIGURATIONS` | `staff enlistment` | View the group its full configuration
   * `VIEW_CONFIGURATIONS` | `global` | View any group its full configuration
   *
   * @param groupId The id of the targeted group
   * @returns GroupConfiguration
   */
  async get(groupId, options) {
    return (await client.get(httpAuth, `/groups/${groupId}`, options)).data;
  },

  /**
   * Update a group configuration.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | Update the group its patient configuration
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | Update the group its staff configuration
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | Update the group its full configuration
   * `UPDATE_CONFIGURATIONS` | `global` | Update any group its full configuration
   *
   * @param groupId The id of the targeted group
   * @param requestBody GroupConfigurationInput
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async update(groupId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/groups/${groupId}${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Delete fields from a group configuration.
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PATIENT_CONFIGURATIONS` | `staff enlistment` | Update the group its patient configuration
   * `UPDATE_STAFF_CONFIGURATIONS` | `staff enlistment` | Update the group its staff configuration
   * `UPDATE_CONFIGURATIONS` | `staff enlistment` | Update the group its full configuration
   * `UPDATE_CONFIGURATIONS` | `global` | Update any group its full configuration
   *
   * @param groupId The id of the targeted group
   * @param requestBody the list of fields to remove
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async removeFields(groupId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/groups/${groupId}/deleteFields${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },
});
