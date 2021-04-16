import type { HttpInstance } from '../../types';
import type { ObjectId } from '../models/ObjectId';
import type { GlobalPermissionsList } from './models/GlobalPermission';
import type { GroupRolePermissions } from './models/GroupRolePermissions';
import type { StaffRoles } from './models/StaffRoles';
import type { StaffGroups } from './models/StaffGroups';
import type { AddRole, GroupRole, GroupRoleList } from './models/Role';
import type { RecordsAffected } from './types';

export default (userClient, httpWithAuth: HttpInstance) => ({
  /**
   * Retrieve a list of group permissions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns any Success
   * @throws ApiError
   */
  async getGroupsPermissions(): Promise<GlobalPermissionsList> {
    return (await userClient.get(httpWithAuth, '/groups/permissions')).data;
  },

  /**
   * Retrieve a list of group roles
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the roles for the group
   * `VIEW_GROUP` | `global` | View any group its roles
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws ApiError
   */
  async getGroupsRoles(groupId: ObjectId, rql = ''): Promise<GroupRoleList> {
    return (
      await userClient.get(httpWithAuth, `/groups/${groupId}/roles${rql}`)
    ).data;
  },

  /**
   * Add role to a group
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_GROUP_ROLE` | `staff enlistment` | Create a role for any group
   * `CREATE_GROUP_ROLE` | `global` | Create a role for the group
   *
   * @param groupId Id of the targeted group
   * @param requestBody
   * @returns any Success
   * @throws ApiError
   */
  async addRoleToGroup(
    groupId: ObjectId,
    requestBody?: AddRole
  ): Promise<GroupRole> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/roles`,
        requestBody
      )
    ).data;
  },

  /**
   * Update a group role
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_GROUP_ROLE` | `staff enlistment` | Update a role for the group
   * `UPDATE_GROUP_ROLE` | `global` | Update a role for any group
   *
   * @param groupId Id of the targeted group
   * @param roleId Id of the targeted role
   * @param requestBody
   * @returns any Success
   * @throws {ResourceUnknownError}
   */
  async updateGroupsRole(
    groupId: ObjectId,
    roleId: ObjectId,
    requestBody?: AddRole
  ): Promise<GroupRole> {
    return (
      await userClient.put(
        httpWithAuth,
        `/groups/${groupId}/roles/${roleId}`,
        requestBody
      )
    ).data;
  },

  /**
   * Remove a role from a group
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_GROUP_ROLE` | `staff enlistment` | Delete a role for the group
   * `DELETE_GROUP_ROLE` | `global` | Delete a role from any group
   *
   * @param groupId Id of the targeted group
   * @param roleId Id of the targeted role
   * @param rql Add filters to the requested list.
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async removeRoleFromGroup(
    groupId: ObjectId,
    roleId: ObjectId,
    rql: string
  ): Promise<RecordsAffected> {
    return (
      await userClient.delete(
        httpWithAuth,
        `/groups/${groupId}/roles/${roleId}${rql}`
      )
    ).data;
  },

  /**
   * Add permissions to group roles
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_GROUP_ROLE_PERMISSION` | `staff enlistment` | Add permissions to roles of the group
   * `ADD_GROUP_ROLE_PERMISSION` | `global` | Add permissions to roles of any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async addPermissionsToGroupRoles(
    groupId: ObjectId,
    rql = '',
    requestBody?: GroupRolePermissions
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/roles/add_permissions${rql}`,
        requestBody
      )
    ).data;
  },

  /**
   * Remove permissions from group roles
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_GROUP_ROLE_PERMISSION` | `staff enlistment` | Remove permissions from roles of the group
   * `REMOVE_GROUP_ROLE_PERMISSION` | `global` | Remove permissions from roles of any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async removePermissionsFromGroupRoles(
    groupId: ObjectId,
    rql: string,
    requestBody?: GroupRolePermissions
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/roles/remove_permissions${rql}`,
        requestBody
      )
    ).data;
  },

  /**
   * Assign roles to staff members of a group
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_GROUP_ROLE_TO_STAFF` | `staff enlistment` | Assign roles for the group
   * `ADD_GROUP_ROLE_TO_STAFF` | `global` | Assign roles for any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async assignRolesToStaff(
    groupId: ObjectId,
    rql = '',
    requestBody?: StaffRoles
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/staff/add_roles${rql}`,
        requestBody
      )
    ).data;
  },

  /**
   * Remove roles from staff members of a group
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_GROUP_ROLE_FROM_STAFF` | `staff enlistment` | Remove roles from staff of the group
   * `REMOVE_GROUP_ROLE_FROM_STAFF` | `global` | Remove roles from staff of any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async removeRolesFromStaff(
    groupId: ObjectId,
    rql: string,
    requestBody?: StaffRoles
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(
        httpWithAuth,
        `/groups/${groupId}/staff/remove_roles${rql}`,
        requestBody
      )
    ).data;
  },

  /**
   * Add users to staff
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_STAFF` | `staff enlistment` | Add staff to the group
   * `ADD_STAFF` | `global` | Add staff to any group
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws ApiError
   */
  async addUserToStaff(
    rql = '',
    requestBody?: StaffGroups
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(httpWithAuth, `/add_to_staff${rql}`, requestBody)
    ).data;
  },

  /**
   * Remove users from staff
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_STAFF` | `staff enlistment` | Remove staff from the group
   * `ADD_STAFF` | `global` | Remove staff from any group
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws ApiError
   */
  async removeUsersFromStaff(
    rql: string,
    requestBody?: StaffGroups
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(
        httpWithAuth,
        `/remove_from_staff${rql}`,
        requestBody
      )
    ).data;
  },
});
