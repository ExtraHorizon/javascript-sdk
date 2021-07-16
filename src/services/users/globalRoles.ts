import type { RQLString } from '../../rql';
import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
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
  async getPermissions(): Promise<PagedResult<GlobalPermission>> {
    return (await userClient.get(httpWithAuth, '/permissions')).data;
  },

  async get(options?: { rql?: RQLString }): Promise<PagedResult<Role>> {
    return (await userClient.get(httpWithAuth, `/roles${options?.rql || ''}`))
      .data;
  },

  async create(requestBody: RoleCreation): Promise<Role> {
    return (await userClient.post(httpWithAuth, `/roles`, requestBody)).data;
  },

  async remove(rql: RQLString): Promise<AffectedRecords> {
    return (await userClient.delete(httpWithAuth, `/roles${rql}`)).data;
  },

  async update(id: ObjectId, requestBody: RoleUpdate): Promise<Role> {
    return (await userClient.put(httpWithAuth, `/roles${id}`, requestBody))
      .data;
  },

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

  async addToUsers(
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(httpWithAuth, `/add_roles${rql}`, requestBody)
    ).data;
  },

  async removeFromUser(
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(httpWithAuth, `/remove_roles${rql}`, requestBody)
    ).data;
  },
});
