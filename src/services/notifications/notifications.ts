import type { AuthHttpClient } from '../../types';
import { rqlBuilder } from '../../rql';
import { NotificationsService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: AuthHttpClient
): NotificationsService => ({
  async create(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        '/',
        {
          ...requestBody,
          ...(requestBody.type === 'message'
            ? {
                fields: {
                  ...requestBody.fields,
                  ...('userId' in httpAuth
                    ? { senderId: await httpAuth.userId }
                    : {}),
                },
              }
            : {}),
        },
        options
      )
    ).data;
  },

  async find(options) {
    return (
      await client.get(httpAuth, `/notifications${options?.rql || ''}`, options)
    ).data;
  },

  async findById(this: NotificationsService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: NotificationsService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async remove(options) {
    return (
      await client.delete(
        httpAuth,
        `/notifications${options?.rql || ''}`,
        options
      )
    ).data;
  },

  async markAsViewed(options) {
    return (
      await client.post(httpAuth, `/viewed${options?.rql || ''}`, options)
    ).data;
  },

  async getTypes(options) {
    return (await client.get(httpAuth, '/types', options)).data;
  },
});
