import { AuthHttpClient } from '../../../types';
import { addPagersFn, findAllGeneric } from '../../helpers';
import { HttpClient } from '../../http-client';
import { NotificationV2User, NotificationV2UserService } from './types';

export default (client: HttpClient, httpWithAuth: AuthHttpClient): NotificationV2UserService => {
  async function find(options) {
    const result = await client.get(httpWithAuth, `/users/${options?.rql || ''}`, options);

    return result.data;
  }

  return {
    async getById(userId, options) {
      const result = await client.get(httpWithAuth, `/users/${userId}`, options);
      return result.data;
    },

    async update(userId, requestBody, options) {
      const result = await client.put(httpWithAuth, `/users/${userId}`, requestBody, options);
      return result.data;
    },

    async remove(userId, options) {
      const result = await client.delete(httpWithAuth, `/users/${userId}`, options);
      return result.data;
    },

    async addOrUpdateDevice(userId, deviceName, requestBody, options) {
      const result = await client.put(httpWithAuth, `/users/${userId}/devices/${deviceName}`, requestBody, options);
      return result.data;
    },

    async removeDevice(userId, deviceName, options) {
      const result = await client.delete(httpWithAuth, `/users/${userId}/devices/${deviceName}`, options);
      return result.data;
    },

    async find(options) {
      const result = await find(options);
      return addPagersFn<NotificationV2User>(find, options, result);
    },

    async findAll(options) {
      return findAllGeneric<NotificationV2User>(find, options);
    },

    async findFirst(options) {
      const result = await find(options);
      return result.data[0];
    },

  };
};
