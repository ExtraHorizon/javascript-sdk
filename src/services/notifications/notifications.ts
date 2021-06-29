import type { OAuthClient } from '../../types';
import { AffectedRecords, PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import { Notification, CreateNotificationRequest, NotifTypeDef } from './types';

export default (client, httpAuth: OAuthClient) => ({
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
    return (
      await client.post(httpAuth, '/', {
        ...requestBody,
        ...(requestBody.type === 'message'
          ? { fields: { ...requestBody.fields, senderId: httpAuth.userId } }
          : {}),
      })
    ).data;
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
  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Notification>> {
    return (await client.get(httpAuth, `/notifications${options?.rql || ''}`))
      .data;
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
  ): Promise<Notification> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<Notification> {
    const res = await this.find(options);
    return res.data[0];
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
