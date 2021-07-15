import type { RQLString } from '../../rql';
import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import { addPagers } from '../utils';
import type {
  RolePermissions,
  Role,
  RoleCreation,
  RoleUpdate,
  UserRoles,
  GlobalPermission,
  UsersGlobalRolesService,
} from './types';

export default (
  userClient,
  httpWithAuth: HttpInstance
): UsersGlobalRolesService => ({
  /**
   * Retrieve a list of permissions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns PagedResult<GlobalPermission>
   */
  async getPermissions(): Promise<PagedResult<GlobalPermission>> {
    const result = (await userClient.get(httpWithAuth, '/permissions')).data;
    return addPagers.call(this, [], {}, result);
  },

  /**
   * Retrieve a list of roles
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Role>
   */
  async get(options?: { rql?: RQLString }): Promise<PagedResult<Role>> {
    const result = (
      await userClient.get(httpWithAuth, `/roles${options?.rql || ''}`)
    ).data;
    return addPagers.call(this, [], {}, result);
  },

  /**
   * Create a role
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_ROLE` | `global` | **Required** for this endpoint
   *
   * @param requestBody The role data
   * @returns Role
   */
  async create(requestBody: RoleCreation): Promise<Role> {
    return (await userClient.post(httpWithAuth, `/roles`, requestBody)).data;
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
  async remove(rql: RQLString): Promise<AffectedRecords> {
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
   */
  async update(id: ObjectId, requestBody: RoleUpdate): Promise<Role> {
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
  async addPermissions(
    rql: RQLString,
    requestBody: RolePermissions
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/roles/add_permissions${rql}`,
        requestBody
      )
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
  async removePermissions(
    rql: RQLString,
    requestBody: RolePermissions
  ): Promise<AffectedRecords> {
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
   * @param requestBody
   * @returns any Operation successful
   */
  async addToUsers(
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords> {
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
   */
  async removeFromUser(
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(httpWithAuth, `/remove_roles${rql}`, requestBody)
    ).data;
  },
});
