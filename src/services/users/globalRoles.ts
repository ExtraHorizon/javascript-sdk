import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { UsersGlobalRolesService } from './types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): UsersGlobalRolesService => ({
  async getPermissions(options) {
    return (await client.get(httpWithAuth, '/permissions', options)).data;
  },

  async get(options) {
    return (
      await client.get(httpWithAuth, `/roles${options?.rql || ''}`, options)
    ).data;
  },

  async create(requestBody, options) {
    return (await client.post(httpWithAuth, `/roles`, requestBody, options))
      .data;
  },

  async remove(rql, options) {
    return (await client.delete(httpWithAuth, `/roles${rql}`, options)).data;
  },

  async update(id, requestBody, options) {
    return (
      await client.put(httpWithAuth, `/roles/${id}`, requestBody, options)
    ).data;
  },

  async addPermissions(rql, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/roles/add_permissions${rql}`,
        requestBody,
        options
      )
    ).data;
  },

  async removePermissions(rql, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/roles/remove_permissions${rql}`,
        requestBody,
        options
      )
    ).data;
  },

  async addToUsers(rql, requestBody, options) {
    return (
      await client.post(httpWithAuth, `/add_roles${rql}`, requestBody, options)
    ).data;
  },

  async removeFromUser(rql, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/remove_roles${rql}`,
        requestBody,
        options
      )
    ).data;
  },
});
