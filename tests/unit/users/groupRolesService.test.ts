import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  parseGlobalPermissions,
  rqlBuilder,
} from '../../../src/index';
import { permissionData, roleData } from '../../__helpers__/user';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Group Roles Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const groupId = '5bfbfc3146e0fb321rsa4b28';
  const roleId = '5bfbfc3146e0fb321rsa4b21';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });
    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  it('should retrieve a list of group permissions', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/groups/permissions')
      .reply(200, createPagedResponse(permissionData));

    const permissions = await sdk.users.groupRoles.getPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of group roles', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${USER_BASE}`)
      .get(`/groups/${groupId}/roles${rql}`)
      .reply(200, createPagedResponse(roleData));

    const roles = await sdk.users.groupRoles.get(groupId, { rql });

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('should add role to a group', async () => {
    const newRole = {
      name: 'newRole',
      description: 'this is a new role',
    };
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/roles`)
      .reply(200, {
        ...newRole,
        id: roleId,
        groupId,
      });

    const res = await sdk.users.groupRoles.add(groupId, newRole);

    expect(res.id).toBe(roleId);
    expect(res.name).toBe(newRole.name);
  });

  it('should update a group role', async () => {
    const newRoleData = {
      name: 'newRoleName',
      description: 'this is a new role description',
    };
    nock(`${host}${USER_BASE}`)
      .put(`/groups/${groupId}/roles/${roleId}`)
      .reply(200, {
        ...newRoleData,
        id: roleId,
        groupId,
      });

    const res = await sdk.users.groupRoles.update(groupId, roleId, newRoleData);

    expect(res.id).toBe(roleId);
    expect(res.name).toBe(newRoleData.name);
  });

  it('should remove a role from a group', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${USER_BASE}`)
      .delete(`/groups/${groupId}/roles/${roleId}${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.remove(rql, groupId, roleId);

    expect(res.affectedRecords).toBe(1);
  });

  it('should add permissions to group roles', async () => {
    const rql = rqlBuilder().build();
    const permissions: string[] = [];
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/roles/add_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.addPermissions(
      groupId,
      {
        permissions: parseGlobalPermissions(permissions),
      },
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove permissions from group roles', async () => {
    const rql = rqlBuilder().build();
    const permissions: string[] = [];
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/roles/remove_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.removePermissions(rql, groupId, {
      permissions: parseGlobalPermissions(permissions),
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should assign roles to staff members of a group', async () => {
    const rql = rqlBuilder().build();
    const roles: string[] = [];
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/staff/add_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.assignToStaff(
      groupId,
      { roles },
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove roles from staff members of a group', async () => {
    const rql = rqlBuilder().build();
    const roles: string[] = [];
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/staff/remove_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.removeFromStaff(rql, groupId, {
      roles,
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should add users to staff', async () => {
    const rql = rqlBuilder().build();
    const groups: string[] = [];
    nock(`${host}${USER_BASE}`)
      .post(`/add_to_staff${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.addUsersToStaff({ groups }, { rql });

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove users from staff', async () => {
    const rql = rqlBuilder().build();
    const groups: string[] = [];
    nock(`${host}${USER_BASE}`)
      .post(`/remove_from_staff${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.removeUsersFromStaff(rql, {
      groups,
    });

    expect(res.affectedRecords).toBe(1);
  });
});
