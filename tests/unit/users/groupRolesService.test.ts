import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import { permissionData, groupRoleData } from '../../__helpers__/user';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Group Roles Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
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

  it('Retrieves a list of group permissions', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/groups/permissions')
      .reply(200, createPagedResponse(permissionData));

    const permissions = await sdk.users.groupRoles.getPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  describe('find', () => {
    it('Returns a list response of roles', async () => {
      const rql = rqlBuilder().eq('name', groupRoleData.name).build();

      nock(`${host}${USER_BASE}`)
        .get(`/groups/${groupId}/roles${rql}`)
        .reply(200, createPagedResponse(groupRoleData));

      const result = await sdk.users.groupRoles.find(groupId, { rql });

      expect(result.data[0]).toMatchObject({
        id: groupRoleData.id,
        groupId: groupRoleData.group_id,
        name: groupRoleData.name,
        description: groupRoleData.description,
        permissions: groupRoleData.permissions,
        creationTimestamp: new Date(groupRoleData.creation_timestamp),
        updateTimestamp: new Date(groupRoleData.update_timestamp),
      });
    });
  });

  describe('findAll', () => {
    it('Returns all roles of a group', async () => {
      nock(`${host}${USER_BASE}`)
        .get(`/groups/${groupId}/roles?limit(50)`)
        .reply(200, createPagedResponse([groupRoleData], { total: 2, offset: 0, limit: 1 }));

      nock(`${host}${USER_BASE}`)
        .get(`/groups/${groupId}/roles?limit(1,1)`)
        .reply(200, createPagedResponse([groupRoleData], { total: 2, offset: 1, limit: 1 }));

      const result = await sdk.users.groupRoles.findAll(groupId);

      expect(result[0].name).toStrictEqual(groupRoleData.name);
      expect(result[1].name).toStrictEqual(groupRoleData.name);
    });
  });

  describe('findFirst', () => {
    it('Returns the first role found', async () => {
      const rql = rqlBuilder().eq('name', groupRoleData.name).build();

      nock(`${host}${USER_BASE}`)
        .get(`/groups/${groupId}/roles${rql}`)
        .reply(200, createPagedResponse(groupRoleData));

      const role = await sdk.users.groupRoles.findFirst(groupId, { rql });

      expect(role.name).toBe(groupRoleData.name);
    });
  });

  describe('findById', () => {
    it('Finds a role by its id', async () => {
      const rql = rqlBuilder().eq('id', groupRoleData.id).build();

      nock(`${host}${USER_BASE}`)
        .get(`/groups/${groupId}/roles${rql}`)
        .reply(200, createPagedResponse(groupRoleData));

      const role = await sdk.users.groupRoles.findById(groupId, groupRoleData.id);

      expect(role.id).toBe(groupRoleData.id);
    });
  });

  describe('findByName', () => {
    it('Finds the first role by its name', async () => {
      const rql = rqlBuilder().eq('name', groupRoleData.name).build();

      nock(`${host}${USER_BASE}`)
        .get(`/groups/${groupId}/roles${rql}`)
        .reply(200, createPagedResponse(groupRoleData));

      const role = await sdk.users.groupRoles.findByName(groupId, groupRoleData.name);

      expect(role.name).toBe(groupRoleData.name);
    });
  });

  it('Retrieves a list of group roles', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${USER_BASE}`)
      .get(`/groups/${groupId}/roles${rql}`)
      .reply(200, createPagedResponse(groupRoleData));

    const roles = await sdk.users.groupRoles.get(groupId, { rql });

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('Adds role to a group', async () => {
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

  it('Updates a group role', async () => {
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

  it('Removes a role from a group', async () => {
    const rql = rqlBuilder().eq('id', roleId).build();
    nock(`${host}${USER_BASE}`)
      .delete(`/groups/${groupId}/roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.remove(rql, groupId);

    expect(res.affectedRecords).toBe(1);
  });

  it('Adds permissions to group roles', async () => {
    const rql = rqlBuilder().build();
    const permissions = [];
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/roles/add_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.addPermissions(
      groupId,
      {
        permissions,
      },
      { rql }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('Removes permissions from group roles', async () => {
    const rql = rqlBuilder().build();
    const permissions = [];
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/roles/remove_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.removePermissions(rql, groupId, {
      permissions,
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('Assigns roles to staff members of a group', async () => {
    const rql = rqlBuilder().build();
    const roles = [];
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

  it('Removes roles from staff members of a group', async () => {
    const rql = rqlBuilder().build();
    const roles = [];
    nock(`${host}${USER_BASE}`)
      .post(`/groups/${groupId}/staff/remove_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.removeFromStaff(rql, groupId, {
      roles,
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('Adds users to staff', async () => {
    const rql = rqlBuilder().build();
    const groups = [];
    nock(`${host}${USER_BASE}`)
      .post(`/add_to_staff${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.addUsersToStaff({ groups }, { rql });

    expect(res.affectedRecords).toBe(1);
  });

  it('Removes users from staff', async () => {
    const rql = rqlBuilder().build();
    const groups = [];
    nock(`${host}${USER_BASE}`)
      .post(`/remove_from_staff${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.groupRoles.removeUsersFromStaff(rql, {
      groups,
    });

    expect(res.affectedRecords).toBe(1);
  });
});
