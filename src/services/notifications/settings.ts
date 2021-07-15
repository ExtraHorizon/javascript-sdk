import type { HttpInstance } from '../../types';
import { AffectedRecords, ObjectId, PagedResult } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  NotificationSettingsServices,
  Setting,
  SettingCreation,
} from './types';
import { addPagers } from '../utils';

export default (
  client,
  httpAuth: HttpInstance
): NotificationSettingsServices => ({
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
    const result = (
      await client.get(httpAuth, `/settings${options?.rql || ''}`)
    ).data;
    return addPagers.call(this, [], options, result);
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Setting> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<Setting> {
    const res = await this.find(options);
    return res.data[0];
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
