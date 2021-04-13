import type { HttpInstance } from '../../types';
import type { ObjectId } from '../models/ObjectId';
import type { PagedResult } from '../models/PagedResult';
import type { GlobalPermission } from './models/GlobalPermission';
import type { RolePermissionsBean } from './models/RolePermissionsBean';
import type { Role } from './models/Role';
import type { UserRolesBean } from './models/UserRolesBean';

export default (userClient, httpWithAuth: HttpInstance) => ({
  /**
   * Retrieve a list of permissions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns any Success
   * @throws ApiError
   */
  async getPermissions(): Promise<
    PagedResult & {
      data?: Array<GlobalPermission>;
    }
  > {
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
   * @throws ApiError
   */
  async getRoles(
    rql = ''
  ): Promise<
    PagedResult & {
      data?: Array<Role>;
    }
  > {
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
   * @throws ApiError
   */
  async createRole(
    rql = '',
    requestBody?: {
      name: string;
      description: string;
    }
  ): Promise<{
    id?: ObjectId;
    name?: string;
    description?: string;
    permissions?: Array<GlobalPermission>;
    creationTimestamp?: number;
    updateTimestamp?: number;
  }> {
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
   * @throws {ResourceNotFound}
   */
  async deleteRole(
    rql: string
  ): Promise<{
    recordsAffected?: number;
  }> {
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
   * @throws ApiError
   */
  async updateRole(
    id: ObjectId,
    requestBody?: {
      name?: string;
      description?: string;
    }
  ): Promise<Role> {
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
   * @throws {ResourceNotFound}
   */
  async addPermissionsToRole(
    requestBody?: RolePermissionsBean
  ): Promise<{
    recordsAffected?: number;
  }> {
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
   * @throws {ResourceNotFound}
   */
  async removePermissionsFromRole(
    rql: string,
    requestBody?: RolePermissionsBean
  ): Promise<{
    recordsAffected?: number;
  }> {
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
   * @throws ApiError
   */
  async addRolesToUsers(
    rql = '',
    requestBody?: UserRolesBean
  ): Promise<{
    recordsAffected?: number;
  }> {
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
   * @throws ApiError
   */
  async removeRolesFromUsers(
    rql: string,
    requestBody?: UserRolesBean
  ): Promise<{
    recordsAffected?: number;
  }> {
    return (
      await userClient.post(httpWithAuth, `/remove_roles${rql}`, requestBody)
    ).data;
  },
});
