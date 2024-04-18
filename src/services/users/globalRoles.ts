import { rqlBuilder } from '../../rql';
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

  async find(options) {
    return (
      await client.get(httpWithAuth, `/roles${options?.rql || ''}`, options)
    ).data;
  },

  async findFirst(options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async findById(id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    return await this.findFirst({ ...options, rql: rqlWithId });
  },

  async findByName(name, options?) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    return await this.findFirst({ ...options, rql: rqlWithName });
  },

  async get(options) {
    return this.find(options);
  },

  async create(requestBody, options) {
    return (await client.post(httpWithAuth, '/roles', requestBody, options))
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
