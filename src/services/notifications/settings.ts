import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import { RQLString } from '../../rql';
import type { Setting } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Retrieve a list of notifications settings
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own notification settings
   * `VIEW_NOTIFICATION_SETTINGS` | `global` | View all notification settings
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws ApiError
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
   * @param userId
   * @param requestBody
   * @returns Setting Success
   * @throws ApiError
   */
  async update(
    userId: string,
    requestBody: {
      key?: string;
      preferences?: Record<string, boolean>;
    }
  ): Promise<Setting> {
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
   * @returns any Operation successful
   * @throws ApiError
   */
  async remove(userId: string): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/settings/${userId}`)).data;
  },
});
