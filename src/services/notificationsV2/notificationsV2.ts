import { rqlBuilder } from '../../rql';
import { AuthHttpClient } from '../../types';
import { addPagersFn, findAllGeneric } from '../helpers';
import { HttpClient } from '../http-client';
import { NotificationV2, NotificationV2Service } from './types';

export default (client: HttpClient, httpWithAuth: AuthHttpClient): NotificationV2Service => {
  async function find(options) {
    const result = await client.get(httpWithAuth, `/${options?.rql || ''}`, options);

    return result.data;
  }

  return {
    async find<T extends Record<string, string>>(options) {
      const result = await find(options);
      return addPagersFn<NotificationV2<T>>(find, options, result);
    },

    async findAll<T extends Record<string, string>>(options) {
      return findAllGeneric<NotificationV2<T>>(find, options);
    },

    async findByTargetUserId<T extends Record<string, string>>(targetUserId, options) {
      const rqlWithTargetUserId = rqlBuilder(options?.rql).eq('targetUserId', targetUserId).build();

      const result = await find({ ...options, rql: rqlWithTargetUserId });
      return addPagersFn<NotificationV2<T>>(find, { ...options, rql: rqlWithTargetUserId }, result);
    },

    async findFirst(options) {
      const result = await find(options);
      return result.data[0];
    },

    async findById(notificationId, options) {
      const rqlWithNotificationId = rqlBuilder().eq('id', notificationId).build();
      const result = await find({ ...options, rql: rqlWithNotificationId });
      return result.data[0];
    },
  };
};
