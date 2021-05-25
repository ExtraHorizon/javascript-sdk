import { RQLString } from '../../rql';

import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { UserConfiguration, UserConfigurationInput } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Get a user configuration
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own configuration
   * `VIEW_PATIENT_CONFIGURATIONS` | `staff enlistment` | For patients of the group, view the patient enlistment configuration of the group
   * `VIEW_STAFF_CONFIGURATIONS` | `staff enlistment` | For staff of the group, view the staff enlistment configuration of the group
   * `VIEW_CONFIGURATIONS` | `staff enlistment` | view the patient enlistment configuration of the group
   * `VIEW_CONFIGURATIONS` | `global` | View any user its full configuration
   *
   * @param userId The id of the targeted user
   * @returns UserConfiguration
   */
  async getUsersConfig(userId: ObjectId): Promise<UserConfiguration> {
    return (await client.get(httpAuth, `/users/${userId}`)).data;
  },

  /**
   * Update a user configuration
   * Only the `data` content
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user configuration
   * none | | Update your own configuration
   *
   * @param userId The id of the targeted user
   * @param requestBody UserConfigurationInput
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async updateUsersConfig(
    userId: ObjectId,
    requestBody: UserConfigurationInput,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },

  /**
   * Delete fields from a user configuration
   * Only from the `data` field
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_CONFIGURATIONS` | `global` | Update any user configuration
   * none | | Update your own configuration
   *
   * @param userId The id of the targeted user
   * @param requestBody the list of fields to remove
   * @param rql Add filters to the requested list
   * @returns AffectedRecords
   */
  async removeFieldsFromUsersConfig(
    userId: ObjectId,
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
        `/users/${userId}/deleteFields${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },
});
