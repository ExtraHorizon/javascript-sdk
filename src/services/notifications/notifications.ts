import type { AuthHttpClient } from '../../types';
import { rqlBuilder } from '../../rql';
import { NotificationsService, Notification } from './types';
import { HttpClient } from '../http-client';
import { findAllIterator, findAllGeneric, addPagersFn } from '../helpers';
import { OptionsWithRql } from '../types';

export default (
  client: HttpClient,
  httpAuth: AuthHttpClient
): NotificationsService => {
  async function find(options?: OptionsWithRql) {
    return (
      await client.get(httpAuth, `/notifications${options?.rql || ''}`, options)
    ).data;
  }
  return {
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
                    senderId: await httpAuth.userId,
                  },
                }
              : {}),
          },
          options
        )
      ).data;
    },

    async find(options) {
      const result = await find(options);
      return addPagersFn<Notification>(find, options as OptionsWithRql, result);
    },

    async findAll(options) {
      return findAllGeneric<Notification>(find, options);
    },

    findAllIterator(options) {
      return findAllIterator<Notification>(find, options);
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
  };
};
