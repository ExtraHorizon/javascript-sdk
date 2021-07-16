import type { RQLString } from '../../rql';
import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type {
  GroupRolePermissions,
  StaffRoles,
  StaffGroups,
  AddRole,
  GroupRole,
  GlobalPermission,
  UsersGroupRolesService,
} from './types';

export default (
  userClient,
  httpWithAuth: HttpInstance
): UsersGroupRolesService => ({
  async getPermissions(): Promise<PagedResult<GlobalPermission>> {
    return (await userClient.get(httpWithAuth, '/groups/permissions')).data;
  },

  async get(
    groupId: ObjectId,
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<GroupRole>> {
    return (
      await userClient.get(
        httpWithAuth,
        `/groups/${groupId}/roles${options?.rql || ''}`
      )
    ).data;
  },

  async add(groupId: ObjectId, requestBody: AddRole): Promise<GroupRole> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/roles`,
        requestBody
      )
    ).data;
  },

  async update(
    groupId: ObjectId,
    roleId: ObjectId,
    requestBody: AddRole
  ): Promise<GroupRole> {
    return (
      await userClient.put(
        httpWithAuth,
        `/groups/${groupId}/roles/${roleId}`,
        requestBody
      )
    ).data;
  },

  async remove(
    rql: RQLString,
    groupId: ObjectId,
    roleId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await userClient.delete(
        httpWithAuth,
        `/groups/${groupId}/roles/${roleId}${rql}`
      )
    ).data;
  },

  async addPermissions(
    groupId: ObjectId,
    requestBody: GroupRolePermissions,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/roles/add_permissions${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },

  async removePermissions(
    rql: RQLString,
    groupId: ObjectId,
    requestBody: GroupRolePermissions
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/roles/remove_permissions${rql}`,
        requestBody
      )
    ).data;
  },

  async assignToStaff(
    groupId: ObjectId,
    requestBody: StaffRoles,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/staff/add_roles${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },

  async removeFromStaff(
    rql: RQLString,
    groupId: ObjectId,
    requestBody: StaffRoles
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/staff/remove_roles${rql}`,
        requestBody
      )
    ).data;
  },

  async addUsersToStaff(
    requestBody: StaffGroups,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/add_to_staff${options?.rql || ''}`,
        requestBody
      )
    ).data;
  },

  async removeUsersFromStaff(
    rql: RQLString,
    requestBody: StaffGroups
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/remove_from_staff${rql}`,
        requestBody
      )
    ).data;
  },
});
