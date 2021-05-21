import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { GroupConfigurationInput, GroupConfiguration } from './types';
import type { RQLString } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
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
  async getGroupsConfig(groupId: ObjectId): Promise<GroupConfiguration> {
    return (await client.get(httpAuth, `/groups/${groupId}`)).data;
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
   * @param requestBody the GroupConfigurationInput
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async updateGroupsConfig(
    groupId: ObjectId,
    requestBody: GroupConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/groups/${groupId}${options?.rql || ''}`,
        requestBody
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
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   */
  async removeFieldsFromGroupsConfig(
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/groups/${groupId}/deleteFields${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },
});
