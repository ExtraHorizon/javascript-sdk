import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import { RQLString } from '../../rql';
import type { Setting, SettingCreation } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Retrieve a list of notifications settings
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own notification settings
   * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notification settings
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Setting>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Setting>> {
    return (await client.get(httpAuth, `/settings${options?.rql || ''}`)).data;
  },

  /**
   * Update the notification settings for a user
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own notification settings
   * `UPDATE_NOTIFICATION_SETTINGS` | `global` | Update all notification settings
   *
   * @param userId The User Id
   * @param requestBody SettingCreation object
   * @returns Setting
   */
  async update(userId: string, requestBody: SettingCreation): Promise<Setting> {
    return (await client.put(httpAuth, `/settings/${userId}`, requestBody))
      .data;
  },

  /**
   * Delete the notifications settings for a user
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_NOTIFICATION_SETTINGS` | `global` | **Required** for this endpoint
   *
   * @param userId
   * @returns AffectedRecords
   */
  async remove(userId: string): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/settings/${userId}`)).data;
  },
});
