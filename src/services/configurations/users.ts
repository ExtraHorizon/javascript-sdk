import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ConfigurationsUsersService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsUsersService => ({
  async get(userId, options) {
    return (await client.get(httpAuth, `/users/${userId}`, options)).data;
  },

  async update(userId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  async removeFields(userId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/users/${userId}/deleteFields${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },
});
