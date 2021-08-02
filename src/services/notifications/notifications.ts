import type { OAuthClient } from '../../types';
import { AffectedRecords, PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import {
  Notification,
  CreateNotificationRequest,
  NotifTypeDef,
  NotificationsService,
} from './types';

export default (client, httpAuth: OAuthClient): NotificationsService => ({
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

  async find(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<Notification>> {
    return (await client.get(httpAuth, `/notifications${options?.rql || ''}`))
      .data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Notification> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Notification> {
    const res = await this.find(options);
    return res.data[0];
  },

  async remove(options?: { rql?: RQLString }): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/notifications${options?.rql || ''}`)
    ).data;
  },

  async markAsViewed(options?: { rql?: RQLString }): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/viewed${options?.rql || ''}`)).data;
  },

  async getTypes(): Promise<PagedResult<NotifTypeDef>> {
    return (await client.get(httpAuth, '/types')).data;
  },
});
