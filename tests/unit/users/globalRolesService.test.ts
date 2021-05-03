import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import { Client, client, rqlBuilder } from '../../../src/index';
import { GlobalPermissionName } from '../../../src/services/users/models/GlobalPermissionName';
import {
  permissionResponse,
  roleResponse,
} from '../../__helpers__/apiResponse';
import { roleData } from '../../__helpers__/user';

describe('Global Roles Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const roleId = '5bfbfc3146e0fb321rsa4b21';

  let sdk: Client;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      clientId: '',
      username: '',
      password: '',
    });
  });

  it('Retrieve a list of permissions', async () => {
    nock(`${apiHost}${USER_BASE}`)
      .get('/permissions')
      .reply(200, permissionResponse);

    const permissions = await sdk.users.getPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  it('Retrieve a list of roles', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${USER_BASE}`).get(`/roles${rql}`).reply(200, roleResponse);

    const roles = await sdk.users.getRoles(rql);

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('Create a role', async () => {
    const newRole = {
      name: 'newRole',
      description: 'this is a new role',
    };
    nock(`${apiHost}${USER_BASE}`)
      .post(`/roles`)
      .reply(200, {
        ...newRole,
        id: roleId,
      });

    const res = await sdk.users.createRole(newRole);

    expect(res.id).toBe(roleId);
    expect(res.name).toBe(newRole.name);
  });

  it('Delete a role', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${USER_BASE}`).delete(`/roles${rql}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.users.deleteRole(rql);

    expect(res.affectedRecords).toBe(1);
  });

  it('Update a role', async () => {
    const id = roleId;
    const requestBody = {
      name: 'newRoleName',
      description: 'this is a new role desc',
    };
    nock(`${apiHost}${USER_BASE}`).put(`/roles${id}`).reply(200, roleData);

    const res = await sdk.users.updateRole(id, requestBody);

    expect(res.id).toBe(roleData.id);
  });

  it('Add permissions to a role', async () => {
    const requestBody = {
      permissions: [GlobalPermissionName.VIEW_PRESCRIPTIONS],
    };
    nock(`${apiHost}${USER_BASE}`)
      .post('/roles/add_permissions')
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.addPermissionsToRole(requestBody);

    expect(res.affectedRecords).toBe(1);
  });

  it('Remove permissions from roles', async () => {
    const rql = rqlBuilder().build();
    const requestBody = {
      permissions: [GlobalPermissionName.VIEW_PRESCRIPTIONS],
    };
    nock(`${apiHost}${USER_BASE}`)
      .post(`/roles/remove_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.removePermissionsFromRole(rql, requestBody);

    expect(res.affectedRecords).toBe(1);
  });

  it('Add roles to users', async () => {
    const rql = rqlBuilder().build();
    const requestBody = {
      roles: [roleId],
    };
    nock(`${apiHost}${USER_BASE}`)
      .post(`/add_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.addRolesToUsers(rql, requestBody);

    expect(res.affectedRecords).toBe(1);
  });

  it('Remove roles from users', async () => {
    const rql = rqlBuilder().build();
    const requestBody = {
      roles: [roleId],
    };
    nock(`${apiHost}${USER_BASE}`)
      .post(`/remove_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.removeRolesFromUsers(rql, requestBody);

    expect(res.affectedRecords).toBe(1);
  });
});
