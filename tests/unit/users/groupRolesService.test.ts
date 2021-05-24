import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2, rqlBuilder } from '../../../src/index';
import {
  permissionResponse,
  roleResponse,
} from '../../__helpers__/apiResponse';

describe('Group Roles Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const groupId = '5bfbfc3146e0fb321rsa4b28';
  const roleId = '5bfbfc3146e0fb321rsa4b21';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
      clientId: '',
    });
    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  it('should retrieve a list of group permissions', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .get('/groups/permissions')
      .reply(200, permissionResponse);

    const permissions = await sdk.users.getGroupsPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of group roles', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${USER_BASE}`)
      .get(`/groups/${groupId}/roles${rql}`)
      .reply(200, roleResponse);

    const roles = await sdk.users.getGroupsRoles(groupId, { rql });

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('should add role to a group', async () => {
    const newRole = {
      name: 'newRole',
      description: 'this is a new role',
    };
    nock(`${apiHost}${USER_BASE}`)
      .post(`/groups/${groupId}/roles`)
      .reply(200, {
        ...newRole,
        id: roleId,
        groupId,
      });

    const res = await sdk.users.addRoleToGroup(groupId, newRole);

    expect(res.id).toBe(roleId);
    expect(res.name).toBe(newRole.name);
  });

  it('should update a group role', async () => {
    const newRoleData = {
      name: 'newRoleName',
      description: 'this is a new role description',
    };
    nock(`${apiHost}${USER_BASE}`)
      .put(`/groups/${groupId}/roles/${roleId}`)
      .reply(200, {
        ...newRoleData,
        id: roleId,
        groupId,
      });

    const res = await sdk.users.updateGroupsRole(groupId, roleId, newRoleData);

    expect(res.id).toBe(roleId);
    expect(res.name).toBe(newRoleData.name);
  });

  it('should remove a role from a group', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${USER_BASE}`)
      .delete(`/groups/${groupId}/roles/${roleId}${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.removeRoleFromGroup(groupId, roleId, rql);

    expect(res.affectedRecords).toBe(1);
  });

  it('should add permissions to group roles', async () => {
    const rql = rqlBuilder().build();
    const permissions = [];
    nock(`${apiHost}${USER_BASE}`)
      .post(`/groups/${groupId}/roles/add_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.addPermissionsToGroupRoles(
      groupId,
      {
        permissions,
      },
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove permissions from group roles', async () => {
    const rql = rqlBuilder().build();
    const permissions = [];
    nock(`${apiHost}${USER_BASE}`)
      .post(`/groups/${groupId}/roles/remove_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.removePermissionsFromGroupRoles(
      groupId,
      {
        permissions,
      },
      rql
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should assign roles to staff members of a group', async () => {
    const rql = rqlBuilder().build();
    const roles = [];
    nock(`${apiHost}${USER_BASE}`)
      .post(`/groups/${groupId}/staff/add_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.assignRolesToStaff(groupId, { roles }, { rql });

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove roles from staff members of a group', async () => {
    const rql = rqlBuilder().build();
    const roles = [];
    nock(`${apiHost}${USER_BASE}`)
      .post(`/groups/${groupId}/staff/remove_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.removeRolesFromStaff(groupId, { roles }, rql);

    expect(res.affectedRecords).toBe(1);
  });

  it('should add users to staff', async () => {
    const rql = rqlBuilder().build();
    const groups = [];
    nock(`${apiHost}${USER_BASE}`)
      .post(`/add_to_staff${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.addUsersToStaff({ groups }, { rql });

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove users from staff', async () => {
    const rql = rqlBuilder().build();
    const groups = [];
    nock(`${apiHost}${USER_BASE}`)
      .post(`/remove_from_staff${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.removeUsersFromStaff({ groups }, rql);

    expect(res.affectedRecords).toBe(1);
  });
});
