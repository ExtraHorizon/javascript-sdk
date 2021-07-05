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
  /**
   * Retrieve a list of group permissions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns PagedResult<GlobalPermission>
   */
  async getPermissions(): Promise<PagedResult<GlobalPermission>> {
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
   * @returns PagedResult<GroupRole>
   */
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

  /**
   * Add role to a group
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_GROUP_ROLE` | `staff enlistment` | Create a role for any group
   * `CREATE_GROUP_ROLE` | `global` | Create a role for the group
   *
   * @param groupId Id of the targeted group
   * @param requestBody The role to add
   * @returns GroupRole
   */
  async add(groupId: ObjectId, requestBody: AddRole): Promise<GroupRole> {
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
   * @param requestBody The role data to update
   * @returns GroupRole
   * @throws {ResourceUnknownError}
   */
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
  async remove(
    groupId: ObjectId,
    roleId: ObjectId,
    rql: RQLString
  ): Promise<AffectedRecords> {
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
  async removePermissions(
    groupId: ObjectId,
    requestBody: GroupRolePermissions,
    rql: RQLString
  ): Promise<AffectedRecords> {
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
  async removeFromStaff(
    groupId: ObjectId,
    requestBody: StaffRoles,
    rql: RQLString
  ): Promise<AffectedRecords> {
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
   * @throws {ResourceUnknownError}
   */
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
   * @throws {ResourceUnknownError}
   */
  async removeUsersFromStaff(
    requestBody: StaffGroups,
    rql: RQLString
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
