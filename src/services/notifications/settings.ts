import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  NotificationSettingsServices,
  Setting,
  SettingCreation,
} from './types';

export default (
  client,
  httpAuth: HttpInstance
): NotificationSettingsServices => ({
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Setting>> {
    return (await client.get(httpAuth, `/settings${options?.rql || ''}`)).data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Setting> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Setting> {
    const res = await this.find(options);
    return res.data[0];
  },

  async update(userId: string, requestBody: SettingCreation): Promise<Setting> {
    return (await client.put(httpAuth, `/settings/${userId}`, requestBody))
      .data;
  },

  async remove(userId: string): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/settings/${userId}`)).data;
  },
});
