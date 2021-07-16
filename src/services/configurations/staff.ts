import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ConfigurationsStaffService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsStaffService => ({
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
  async update(groupId, userId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}/staffConfigurations/${groupId}`,
        requestBody,
        options
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
  async removeFields(groupId, userId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/users/${userId}/staffConfigurations/${groupId}/deleteFields`,
        requestBody,
        options
      )
    ).data;
  },
});
