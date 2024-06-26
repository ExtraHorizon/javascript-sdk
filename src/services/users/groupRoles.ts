import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { UsersGroupRolesService } from './types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): UsersGroupRolesService => ({
  async getPermissions(options) {
    return (await client.get(httpWithAuth, '/groups/permissions', options))
      .data;
  },

  async find(groupId, options) {
    return (
      await client.get(
        httpWithAuth,
        `/groups/${groupId}/roles${options?.rql || ''}`,
        options
      )
    ).data;
  },

  async findFirst(groupId, options) {
    const res = await this.find(groupId, options);
    return res.data[0];
  },

  async findById(groupId, roleId, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', roleId).build();
    return await this.findFirst(groupId, { ...options, rql: rqlWithId });
  },

  async findByName(groupId, roleName, options?) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', roleName).build();
    return await this.findFirst(groupId, { ...options, rql: rqlWithName });
  },

  async get(groupId, options) {
    return this.find(groupId, options);
  },

  async add(groupId, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/groups/${groupId}/roles`,
        requestBody,
        options
      )
    ).data;
  },

  async update(groupId, roleId, requestBody, options) {
    return (
      await client.put(
        httpWithAuth,
        `/groups/${groupId}/roles/${roleId}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(rql, groupId, options) {
    return (
      await client.delete(
        httpWithAuth,
        `/groups/${groupId}/roles${rql}`,
        options
      )
    ).data;
  },

  async addPermissions(groupId, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/groups/${groupId}/roles/add_permissions${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  async removePermissions(rql, groupId, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/groups/${groupId}/roles/remove_permissions${rql}`,
        requestBody,
        options
      )
    ).data;
  },

  async assignToStaff(groupId, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/groups/${groupId}/staff/add_roles${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  async removeFromStaff(rql, groupId, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/groups/${groupId}/staff/remove_roles${rql}`,
        requestBody,
        options
      )
    ).data;
  },

  async addUsersToStaff(requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/add_to_staff${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  async removeUsersFromStaff(rql, requestBody, options) {
    return (
      await client.post(
        httpWithAuth,
        `/remove_from_staff${rql}`,
        requestBody,
        options
      )
    ).data;
  },
});
