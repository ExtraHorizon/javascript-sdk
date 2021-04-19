import type { HttpInstance } from '../../types';
import type { ObjectId } from '../models/ObjectId';
import type { GlobalPermissionsList } from './models/GlobalPermission';
import type { RolePermissions } from './models/RolePermissions';
import type { Role, RoleCreation, RoleList, RoleUpdate } from './models/Role';
import type { UserRoles } from './models/UserRoles';
import { RecordsAffected } from './types';

export default (userClient, httpWithAuth: HttpInstance) => ({
  /**
   * Retrieve a list of permissions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns any Success
   * @throws {ApiError}
   */
  async getPermissions(): Promise<GlobalPermissionsList> {
    return (await userClient.get(httpWithAuth, '/permissions')).data;
  },

  /**
   * Retrieve a list of roles
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws {ApiError}
   */
  async getRoles(rql = ''): Promise<RoleList> {
    return (await userClient.get(httpWithAuth, `/roles${rql}`)).data;
  },

  /**
   * Create a role
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_ROLE` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Success
   * @throws {ApiError}
   */
  async createRole(rql = '', requestBody: RoleCreation): Promise<Role> {
    return (await userClient.post(httpWithAuth, `/roles${rql}`, requestBody))
      .data;
  },

  /**
   * Delete a role
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_ROLE` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async deleteRole(rql: string): Promise<RecordsAffected> {
    return (await userClient.delete(httpWithAuth, `/roles${rql}`)).data;
  },

  /**
   * Update a role
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ROLE` | `global` | **Required** for this endpoint
   *
   * @param id Id of the targeted role
   * @param requestBody
   * @returns Role Success
   * @throws {ApiError}
   */
  async updateRole(id: ObjectId, requestBody: RoleUpdate): Promise<Role> {
    return (await userClient.put(httpWithAuth, `/roles${id}`, requestBody))
      .data;
  },

  /**
   * Add permissions to a role
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_ROLE_PERMISSIONS` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async addPermissionsToRole(
    requestBody?: RolePermissions
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(httpWithAuth, '/roles/add_permissions', requestBody)
    ).data;
  },

  /**
   * Remove permissions from roles
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_ROLE_PERMISSIONS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async removePermissionsFromRole(
    rql: string,
    requestBody?: RolePermissions
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(
        httpWithAuth,
        `/roles/remove_permissions${rql}`,
        requestBody
      )
    ).data;
  },

  /**
   * Add roles to users
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_ROLE_TO_USER` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ApiError}
   */
  async addRolesToUsers(
    rql = '',
    requestBody?: UserRoles
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(httpWithAuth, `/add_roles${rql}`, requestBody)
    ).data;
  },

  /**
   * Remove roles from users
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_ROLE_FROM_USER` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ApiError}
   */
  async removeRolesFromUsers(
    rql: string,
    requestBody?: UserRoles
  ): Promise<RecordsAffected> {
    return (
      await userClient.post(httpWithAuth, `/remove_roles${rql}`, requestBody)
    ).data;
  },
});
