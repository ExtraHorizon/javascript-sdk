import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { NotificationSettingsServices } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): NotificationSettingsServices => ({
  async find(options) {
    return (
      await client.get(httpAuth, `/settings${options?.rql || ''}`, options)
    ).data;
  },

  async findById(this: NotificationSettingsServices, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: NotificationSettingsServices, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async update(userId, requestBody, options) {
    return (
      await client.put(httpAuth, `/settings/${userId}`, requestBody, options)
    ).data;
  },

  async remove(userId, options) {
    return (await client.delete(httpAuth, `/settings/${userId}`, options)).data;
  },
});
