import * as nock from 'nock';
import * as sdk from '../../src/index';
import { apiHost } from '../__helpers__/config';
import { userData, updatedUserData, newUserData, roleData } from '../__helpers__/user';
import { userResponse, permissionResponse, roleResponse } from '../__helpers__/apiResponse';
import { ResourceUnknownException } from '../__helpers__/user';

describe('Users', () => {
  const userId = '5a0b2adc265ced65a8cab865';
  const groupId = '5bfbfc3146e0fb321rsa4b28';
  const oldEmail = 'test@test.test';
  const newEmail = 'testje@testje.testje';
  const oldPass = 'OldPass123';
  const newPass = 'NewPass123';
  const hash = 'bced43a8ccb74868536ae8bc5a13a40385265038';

  it('Can get health', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/health')
      .reply(200, '');

    const health = await sdk.users.getHealth();

    expect(health).toBe(true);
  });

  it('Can get current', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/me')
      .reply(200, userData);

    const user = await sdk.users.getCurrent();

    expect(user.id);
  });

  it('Can get users list', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/')
      .reply(200, userResponse);

    const users = await sdk.users.getList();

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('Can get patients list', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/patients')
      .reply(200, userResponse);

    const users = await sdk.users.getPatients();

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('Can get staff list', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/staff')
      .reply(200, userResponse);

    const users = await sdk.users.getStaff();

    expect(users.data.length).toBeGreaterThan(0);
  });

  it('Can get user by id', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/${userId}`)
      .reply(200, userData);

    const user = await sdk.users.getById(userId);

    expect(user.id);
  });

  it('Can not get user by id', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/${userId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.getById(userId);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can update a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/${userId}`)
      .reply(200, updatedUserData);

    const user = await sdk.users.update(userId, { first_name: 'testje', last_name: 'testje' });

    expect(user.firstName).toBe('testje');
    expect(user.lastName).toBe('testje');
  });

  it('Can not update a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/${userId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.update(userId, { first_name: 'testje', last_name: 'testje' });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can remove a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.remove(userId);

    expect(result).toBeGreaterThan(0);
  });

  it('Can not remove a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.remove(userId);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can update a users email', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/${userId}/email`)
      .reply(200, updatedUserData);

    const user = await sdk.users.updateEmail(userId, newEmail);

    expect(user.email).toBe(newEmail);
  });

  it('Add a patient enlistment to a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/${userId}/patient_enlistments`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.addPatientEnlistment(userId, groupId);

    expect(result).toBeGreaterThan(0);
  });

  it('Can remove a patient enlistment from a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}/patient_enlistments/${groupId}`)
      .reply(200, { recordsAffected: 1 });

    const result = await sdk.users.deletePatientEnlistment(userId, groupId);

    expect(result).toBeGreaterThan(0);
  });

  it('Can not remove a patient enlistment from a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/${userId}/patient_enlistments/${groupId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.deletePatientEnlistment(userId, groupId);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can register a new user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/register')
      .reply(200, newUserData);

    const newUser = await sdk.users.register(newUserData);

    expect(newUser.id);
  });

  it('Can update a users password', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/password`)
      .reply(200, userData);

    const result = await sdk.users.updatePassword(oldPass, newPass);

    expect(result).toBe(true);
  });

  it('Can authenticate', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/authenticate')
      .reply(200, userData);

    const authenticatedUser = await sdk.users.authenticate(oldEmail, newPass);

    expect(authenticatedUser.id);
  });

  it('Can request activation mail', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/activation?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.requestActivationMail(newEmail);

    expect(result).toBe(true);
  });

  it('Can complete an email activation', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/activation')
      .reply(200);

    const result = await sdk.users.completeActivationMail(hash);

    expect(result).toBe(true);
  });

  it('Can request a password reset', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/forgot_password?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.requestPasswordReset(newEmail);

    expect(result).toBe(true);
  });

  it('Can complete a password reset', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/forgot_password')
      .reply(200);

    const result = await sdk.users.completePasswordReset(hash, newPass);

    expect(result).toBe(true);
  });

  it('Confirm the password for the user making the request', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/confirm_password')
      .reply(200);

    const result = await sdk.users.confirmPassword(newPass);

    expect(result).toBe(true);
  });

  it('Can check if email is available', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/email_available?email=${newEmail}`)
      .reply(200);

    const result = await sdk.users.emailAvailable(newEmail);

    expect(result).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});

describe('Global roles', () => {
  const roleId = '5bfbfc3146e0fb321rsa4b28';

  const permissionList = {
    "permissions": [
      "VIEW_PRESCRIPTIONS"
    ]
  }

  const roleList = {
    "roles": [
      "5bfbfc3146e0fb321rsa4b28"
    ]
  }

  it('Can retrieve a list of permissions', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/permissions')
      .reply(200, permissionResponse);

    const permissions = await sdk.users.getGlobalPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  it('Can retrieve a list of roles', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/roles')
      .reply(200, roleResponse);

    const roles = await sdk.users.getGlobalRoles();

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('Can create a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/roles')
      .reply(200, roleData);

    const role = await sdk.users.createGlobalRole();

    expect(role.id);
  });

  it('Can delete a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete('/roles')
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.removeGlobalRole();

    expect(role).toBeGreaterThan(0);
  });

  it('Can not delete a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete('/roles')
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.removeGlobalRole();
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can update a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/roles/${roleId}`)
      .reply(200, roleData);

    const role = await sdk.users.updateGlobalRole(roleId);

    expect(role.id);
  });

  it('Can add permissions to a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/roles/add_permissions')
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.addPermissionToGlobalRoles(permissionList.permissions);

    expect(role).toBeGreaterThan(0);
  });

  it('Can not add permissions to a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/roles/add_permissions')
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.addPermissionToGlobalRoles(permissionList.permissions);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can remove permissions from a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/roles/remove_permissions')
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.removePermissionFromGlobalRoles(permissionList.permissions, '');

    expect(role).toBeGreaterThan(0);
  });

  it('Can not remove permissions from a role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/roles/remove_permissions')
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.removePermissionFromGlobalRoles(permissionList.permissions, '');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can add a role to a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/add_roles')
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.addGlobalRolesToUser(roleList.roles);

    expect(role).toBeGreaterThan(0);
  });

  it('Can remove a role from a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/remove_roles')
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.removeGlobalRoleFromUser(roleList.roles);

    expect(role).toBeGreaterThan(0);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});

describe('Group roles', () => {
  const roleId = '5bfbfc3146e0fb321rsa4b28';
  const groupId = '5bfbfc3146e0fb321rsa4b28';

  const permissionList = {
    "permissions": [
      "VIEW_PRESCRIPTIONS"
    ]
  }

  const roleList = {
    "roles": [
      "5bfbfc3146e0fb321rsa4b28"
    ]
  }

  const groupList = {
    "groups": [
      "5bfbfc3146e0fb321rsa4b28"
    ]
  }

  it('Can retrieve a list of group permissions', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get('/groups/permissions')
      .reply(200, permissionResponse);

    const permissions = await sdk.users.getGroupPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  it('Can retrieve a list of roles for a specific group', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .get(`/groups/${groupId}/roles`)
      .reply(200, roleResponse);

    const roles = await sdk.users.getGroupRoles(groupId);

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('Can add a role to a group', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/roles`)
      .reply(200, roleData);

    const role = await sdk.users.addRoleToGroup(groupId, 'test', 'test');

    expect(role.id);
  });

  it('Can update a group role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/groups/${groupId}/roles/${roleId}`)
      .reply(200, roleData);

    const role = await sdk.users.updateGroupRole(groupId, roleId, 'test', 'test');

    expect(role.id);
  });

  it('Can not update a group role', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .put(`/groups/${groupId}/roles/${roleId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.updateGroupRole(groupId, roleId, 'test', 'test');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can delete a role from a group', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/groups/${groupId}/roles/${roleId}`)
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.deleteGroupRole(groupId, roleId);

    expect(role).toBeGreaterThan(0);
  });

  it('Can not delete a role from a group', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .delete(`/groups/${groupId}/roles/${roleId}`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.deleteGroupRole(groupId, roleId);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can add permissions to group roles', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/roles/add_permissions`)
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.addPermissionToGroupRoles(groupId, permissionList.permissions);

    expect(role).toBeGreaterThan(0);
  });

  it('Can not add permissions to group roles', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/roles/add_permissions`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.addPermissionToGroupRoles(groupId, permissionList.permissions);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can remove permissions from group roles', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/roles/remove_permissions`)
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.removePermissionFromGroupRoles(groupId, permissionList.permissions, '');

    expect(role).toBeGreaterThan(0);
  });

  it('Can not remove permissions from group roles', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/roles/remove_permissions`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.removePermissionFromGroupRoles(groupId, permissionList.permissions, '');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can assign roles to staff members of a group', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/staff/add_roles`)
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.addGroupRoles(groupId, roleList.roles);

    expect(role).toBeGreaterThan(0);
  });

  it('Can not assign roles to staff members of a group', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/staff/add_roles`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.addGroupRoles(groupId, roleList.roles);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can remove a role from a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/staff/remove_roles`)
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.removeGroupRoles(groupId, roleList.roles);

    expect(role).toBeGreaterThan(0);
  });

  it('Can not remove a role from a user', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post(`/groups/${groupId}/staff/remove_roles`)
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.removeGroupRoles(groupId, roleList.roles);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can add users to staff', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/add_to_staff')
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.addUsersToStaff(groupList.groups);

    expect(role).toBeGreaterThan(0);
  });

  it('Can not add users to staff', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/add_to_staff')
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.addUsersToStaff(groupList.groups);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  it('Can remove users from staff', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/remove_from_staff')
      .reply(200, { recordsAffected: 1 });

    const role = await sdk.users.removeUsersFromStaff(groupList.groups);

    expect(role).toBeGreaterThan(0);
  });

  it('Can not remove users from staff', async () => {
    nock(`https://api.${apiHost}/users/v1`)
      .post('/remove_from_staff')
      .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await sdk.users.removeUsersFromStaff(groupList.groups);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe("RESOURCE_UNKNOWN_EXCEPTION");
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});