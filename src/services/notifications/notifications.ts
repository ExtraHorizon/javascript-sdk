import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import { RQLString } from '../../rql';
import type {
  Notification,
  CreateNotificationRequest,
  NotifTypeDef,
} from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Retrieve a list of your own notifications
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Notification>
   */
  async findMyNotifications(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Notification>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Create a notification
   * Permission | Scope | Effect
   * - | - | -
   * none | | Create a notification for yourself
   * `CREATE_NOTIFICATIONS` | `global` | Create a notification for another person
   *
   * @param requestBody CreateNotificationRequest
   * @returns Notification
   */
  async create(requestBody: CreateNotificationRequest): Promise<Notification> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Retrieve a list of notifications
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your own notifications
   * `VIEW_NOTIFICATIONS` | `global` | View all notifications
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Notification>
   */
  async findNotifications(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Notification>> {
    return (await client.get(httpAuth, `/notifications${options?.rql || ''}`))
      .data;
  },

  /**
   * Delete notification(s)
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_NOTIFICATIONS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async remove(options?: { rql?: RQLString }): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/notifications${options?.rql || ''}`)
    ).data;
  },

  /**
   * Mark your notification(s) as viewed
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  async markAsViewed(options?: { rql?: RQLString }): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/viewed${options?.rql || ''}`)).data;
  },

  /**
   * Retrieve the list of notification types
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns PagedResult<NotifTypeDef>
   */
  async getTypes(): Promise<PagedResult<NotifTypeDef>> {
    return (await client.get(httpAuth, '/types')).data;
  },
});
