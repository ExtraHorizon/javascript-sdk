import * as nock from 'nock';
import { client } from '../../../src/index';
import {
  permissionResponse,
  roleResponse,
} from '../../__helpers__/apiResponse';

describe('Group Roles Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const groupId = '5bfbfc3146e0fb321rsa4b28';
  const roleId = '5bfbfc3146e0fb321rsa4b21';

  let sdk;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });
    const mockToken = 'mockToken';
    nock(apiHost)
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });

    await sdk.authenticate({
      clientId: '',
      username: '',
      password: '',
    });
  });

  it('Retrieve a list of group permissions', async () => {
    nock(`${apiHost}/users/v1`)
      .get('/groups/permissions')
      .reply(200, permissionResponse);

    const permissions = await sdk.users.getGroupsPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  it('Retrieve a list of group roles', async () => {
    const rql = '';
    nock(`${apiHost}/users/v1`)
      .get(`/groups/${groupId}/roles${rql}`)
      .reply(200, roleResponse);

    const roles = await sdk.users.getGroupsRoles(groupId, rql);

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('Add role to a group', async () => {
    const newRole = {
      name: 'newRole',
      description: 'this is a new role',
    };
    nock(`${apiHost}/users/v1`)
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

  it('Update a group role', async () => {
    const newRoleData = {
      name: 'newRoleName',
      description: 'this is a new role description',
    };
    nock(`${apiHost}/users/v1`)
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

  it('Remove a role from a group', async () => {
    const rql = '';
    nock(`${apiHost}/users/v1`)
      .delete(`/groups/${groupId}/roles/${roleId}${rql}`)
      .reply(200, { recordsAffected: 1 });

    const res = await sdk.users.removeRoleFromGroup(groupId, roleId, rql);

    expect(res.recordsAffected).toBe(1);
  });

  it('Add permissions to group roles', async () => {
    const rql = '';
    const permissions = [];
    nock(`${apiHost}/users/v1`)
      .post(`/groups/${groupId}/roles/add_permissions${rql}`)
      .reply(200, { recordsAffected: 1 });

    const res = await sdk.users.addPermissionsToGroupRoles(groupId, rql, {
      permissions,
    });

    expect(res.recordsAffected).toBe(1);
  });

  it('Remove permissions from group roles', async () => {
    const rql = '';
    const permissions = [];
    nock(`${apiHost}/users/v1`)
      .post(`/groups/${groupId}/roles/remove_permissions${rql}`)
      .reply(200, { recordsAffected: 1 });

    const res = await sdk.users.removePermissionsFromGroupRoles(groupId, rql, {
      permissions,
    });

    expect(res.recordsAffected).toBe(1);
  });

  it('Assign roles to staff members of a group', async () => {
    const rql = '';
    const roles = [];
    nock(`${apiHost}/users/v1`)
      .post(`/groups/${groupId}/staff/add_roles${rql}`)
      .reply(200, { recordsAffected: 1 });

    const res = await sdk.users.assignRolesToStaff(groupId, rql, { roles });

    expect(res.recordsAffected).toBe(1);
  });

  it('Remove roles from staff members of a group', async () => {
    const rql = '';
    const roles = [];
    nock(`${apiHost}/users/v1`)
      .post(`/groups/${groupId}/staff/remove_roles${rql}`)
      .reply(200, { recordsAffected: 1 });

    const res = await sdk.users.removeRolesFromStaff(groupId, rql, { roles });

    expect(res.recordsAffected).toBe(1);
  });

  it('Add users to staff', async () => {
    const rql = '';
    const groups = [];
    nock(`${apiHost}/users/v1`)
      .post(`/add_to_staff${rql}`)
      .reply(200, { recordsAffected: 1 });

    const res = await sdk.users.addUserToStaff(rql, { groups });

    expect(res.recordsAffected).toBe(1);
  });

  it('Remove users from staff', async () => {
    const rql = '';
    const groups = [];
    nock(`${apiHost}/users/v1`)
      .post(`/remove_from_staff${rql}`)
      .reply(200, { recordsAffected: 1 });

    const res = await sdk.users.removeUsersFromStaff(rql, { groups });

    expect(res.recordsAffected).toBe(1);
  });
});
