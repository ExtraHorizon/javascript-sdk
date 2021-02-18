import { ApiClient } from '../oauth1-api';
import { RegisterUserData, UserData, UserDataList, PermissionDataList, RolesDataList, Role } from './models';
import { recordsAffectedResponse, resultResponse, Results } from '../models';
import { typeReceivedError } from '../errorHandler';

const userServiceClient = new ApiClient('users', 'v1');

/**
 * Perform a health check
 * @permission Everyone can use this endpoint
 * @returns {boolean} success
 */
export async function getHealth(): Promise<boolean> {
  try {
    const result: resultResponse = await userServiceClient.get('health');
    return result.status === Results.Success;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve the current logged in user
 * @permission Everyone can use this endpoint
 * @returns {UserData} UserData
 */
export async function getCurrent(): Promise<UserData> {
  try {
    return await userServiceClient.get('me') as UserData;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a list of users
 * @params {string} rql Add filters to the requested list (optional)
 * @permission See a subset of fields from all staff members of groups where you have a patient enlistment
 * @permission --------- | scope:group  | See a subset of fields from all patients of the group
 * @permission VIEW_USER | scope:global | See all fields of all users
 * @returns {UserDataList} UserDataList
 */
export async function getList(rql = ''): Promise<UserDataList> {
  try {
    return await userServiceClient.get(rql) as UserDataList;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a list of users that have a patient enlistment
 * @params {string} rql Add filters to the requested list (optional)
 * @permission --------- | scope:group  | View the patients of the group
 * @permission VIEW_PATIENTS | scope:global | View all patients
 * @returns {UserDataList} UserDataList
 */
export async function getPatients(rql = ''): Promise<UserDataList> {
  try {
    return await userServiceClient.get(`patients${rql}`) as UserDataList;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a list of users that have a staff enlistment
 * @params {string} rql Add filters to the requested list (optional)
 * @permission --------- | scope:group  | View the other staff members of the group
 * @permission VIEW_STAFF | scope:global | View all staff members
 * @returns {UserDataList} UserDataList
 */
export async function getStaff(rql = ''): Promise<UserDataList> {
  try {
    return await userServiceClient.get(`staff${rql}`) as UserDataList;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a specific user
 * @params {string} userId of the targeted user (required)
 * @permission See your own user object
 * @permission --------- | scope:group  | See a subset of the fields for any staff member or patient of the group
 * @permission VIEW_PATIENTS | scope:global | See a subset of fields for any user with a patient enlistment
 * @permission VIEW_STAFF | scope:global | See a subset of fields for any user with a staff enlistment
 * @permission VIEW_USER | scope:global | See any user object
 * @throws {ResourceUnknownError}
 * @returns {UserData} UserData
 */
export async function getById(userId: string): Promise<UserData> {
  try {
    return await userServiceClient.get(userId) as UserData;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Update a specific user
 * @params {string} userId of the targeted user (required)
 * @params {any} data Fields to update
 * @permission Update your own data
 * @permission UPDATE_USER | scope:global | Update any user
 * @throws {ResourceUnknownError}
 * @returns {UserData} UserData
 */
export async function update(userId: string, data: any): Promise<UserData> {
  try {
    return await userServiceClient.put(userId, data) as UserData;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Delete a specific user
 * @params {string} userId of the targeted user (required)
 * @permission Delete your own user object
 * @permission DELETE_USER | scope:global | Delete any user
 * @throws {ResourceUnknownError}
 * @returns {boolean} success
 */
export async function remove(userId: string): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.delete(userId);

    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Update the email address of a specific user
 * @params {string} userId of the targeted user (required)
 * @params {string} email
 * An email is send to validate and activate the new address.
 * @permission Update your own data
 * @permission UPDATE_USER_EMAIL | scope:global | Update any user
 * @throws {EmailUsedError}
 * @throws {ResourceUnknownError}
 * @returns {UserData} UserData
 */
export async function updateEmail(userId: string, email: string): Promise<UserData> {
  try {
    return await userServiceClient.put(`${userId}/email`, { email }) as UserData;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Add a patient enlistment to a user
 * @params {string} userId of the targeted user (required)
 * @params {string} groupId of the targeted group (required)
 * @permission ADD_PATIENT | scope:global | Add any patient enlistment
 * @throws {ResourceAlreadyExistsError}
 * @returns {number} affectedRecords
 */
export async function addPatientEnlistment(userId: string, groupId: string): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`${userId}/patient_enlistments`, { groupId });

    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Remove a patient enlistment from a user.
 * @params {string} userId of the targeted user (required)
 * @params {string} groupId of the targeted group (required)
 * @permission Remove a patient enlistment from yourself
 * @permission REMOVE_PATIENT | scope:group | Remove a patient enlistment for the group
 * @permission REMOVE_PATIENT | scope:global | Remove any patient enlistment
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function deletePatientEnlistment(userId: string, groupId: string): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.delete(`${userId}/patient_enlistments/${groupId}`);

    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Create an account
 * @params {RegisterUserData} registerData Data necessary to register (required)
 * @permission Everyone can use this endpoint
 * @returns {UserData} UserData
 * @throws {EmailUsedError}
 */
export async function register(data: RegisterUserData): Promise<UserData> {
  try {
    return await userServiceClient.post('register', data) as UserData;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Change your password
 * @params {string} Old password (required)
 * @params {string} New password (required)
 * @permission Everyone can use this endpoint
 * @throws {PasswordError}
 * @returns {boolean} success
 */
export async function updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  try {
    const result = await userServiceClient.put('password', { oldPassword, newPassword });

    return !!result.id;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Authenticate a user
 * @params {string} email (required)
 * @params {string} password (required)
 * @permission Everyone can use this endpoint
 * @throws {AuthenticationError}
 * @throws {LoginTimeoutError}
 * @throws {LoginFreezeError}
 * @throws {TooManyFailedAttemptsError}
 * @returns {UserData} UserData
 */
export async function authenticate(email: string, password: string): Promise<UserData> {
  try {
    return await userServiceClient.post('authenticate', { email, password }) as UserData;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Request an email activation
 * @params {string} email (required)
 * @permission Everyone can use this endpoint
 * @returns {boolean} success
 * @throws {EmailUnknownError}
 * @throws {AlreadyActivatedError}
 */
export async function requestActivationMail(email: string): Promise<boolean> {
  try {
    const result: resultResponse = await userServiceClient.get(`activation?email=${email}`);
    return result.status === Results.Success;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Complete an email activation
 * @params {string} hash (required)
 * @permission Everyone can use this endpoint
 * @throws {ActivationUnknownError}
 * @returns {boolean} success
 */
export async function completeActivationMail(hash: string): Promise<boolean> {
  try {
    const result: resultResponse = await userServiceClient.post('activation', { hash });
    return result.status === Results.Success;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Request a password reset
 * @params {string} email (required)
 * @permission Everyone can use this endpoint
 * @throws {EmailUnknownError}
 * @throws {NotActivatedError}
 * @returns {boolean} success
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    const result: resultResponse = await userServiceClient.get(`forgot_password?email=${email}`);
    return result.status === Results.Success;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Complete a password reset
 * @params {string} email (required)
 * @params {string} new password (required)
 * @permission Everyone can use this endpoint
 * @throws {NotActivatedError}
 * @throws {NewPasswordHashUnknownError}
 * @returns {boolean} success
 */
export async function completePasswordReset(hash: string, newPassword: string): Promise<boolean> {
  try {
    const result: resultResponse = await userServiceClient.post('forgot_password', { hash, newPassword });
    return result.status === Results.Success;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Confirm the password for the user making the request
 * @params {string} password (required)
 * @permission Everyone can use this endpoint
 * @throws {AuthenticationError}
 * @throws {LoginTimeoutError}
 * @throws {LoginFreezeError}
 * @throws {TooManyFailedAttemptsError}
 * @returns {boolean} success
 */
export async function confirmPassword(password: string): Promise<boolean> {
  try {
    const result: resultResponse = await userServiceClient.post('confirm_password', { password });
    return result.status === Results.Success;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Check if an email address is still available
 * @params {string} email (required)
 * @permission Everyone can use this endpoint
 * @returns {boolean} success
 */
export async function emailAvailable(email: string): Promise<boolean> {
  try {
    const result: resultResponse = await userServiceClient.get(`email_available?email=${email}`);
    return result.status === Results.Success;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a list of global permissions
 * @permission Everyone can use this endpoint
 * @returns {PermissionDataList} PermissionDataList
 */
export async function getGlobalPermissions(): Promise<PermissionDataList> {
  try {
    return await userServiceClient.get('permissions') as PermissionDataList;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a list of global roles
 * @permission Everyone can use this endpoint
 * @returns {RolesDataList} RolesDataList
 */
export async function getGlobalRoles(rql = ''): Promise<RolesDataList> {
  try {
    return await userServiceClient.get(`roles${rql}`) as RolesDataList;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Create a global role
 * @params {RegisterUserData} registerData Data necessary to register (required)
 * @permission CREATE_ROLE | scope:global | Create all roles
 * @returns {Role} Role
 */
export async function createGlobalRole(rql = ''): Promise<Role> {
  try {
    return await userServiceClient.post(`roles${rql}`) as Role;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Delete a global role
 * @params {string} userId of the targeted user (required)
 * @permission Delete your own user object
 * @permission DELETE_ROLE | scope:global | Delete any user
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function removeGlobalRole(rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.delete(`roles${rql}`);
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Update a global role
 * @params {string} roleId (required)
 * @permission Update roles
 * @permission UPDATE_ROLE | scope:global | Update any role
 * @returns {Role} Role
 */
export async function updateGlobalRole(roleId: string): Promise<Role> {
  try {
    return await userServiceClient.put(`roles/${roleId}`) as Role;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Add global roles from permission
 * @permission Add your own roles
 * @permission ADD_ROLE_PERMISSIONS | scope:global | Add permission to a role
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function addPermissionToGlobalRoles(permissions: string[]): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post('roles/add_permissions', { permissions });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Add global roles from permission
 * @params {string} rql Add filters to the requested list (optional)
 * @permission Remove your own roles
 * @permission REMOVE_ROLE_PERMISSIONS | scope:global | Remove permission from role
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function removePermissionFromGlobalRoles(permissions: string[], rql: string): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`roles/remove_permissions${rql}`, { permissions });

    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Add global roles to users
 * @params {string} rql Add filters to the requested list (optional)
 * @permission Add global roles to user
 * @permission ADD_ROLE_TO_USER | scope:global | Add any global role to the user
 * @returns {number} affectedRecords
 */
export async function addGlobalRolesToUser(roles: string[], rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`add_roles${rql}`, { roles });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Remove global roles from users
 * @params {string} rql Add filters to the requested list (optional)
 * @permission Remove role from user
 * @permission REMOVE_ROLE_FROM_USER | scope:global | Remove any global role from user
 * @returns {number} affectedRecords
 */
export async function removeGlobalRoleFromUser(roles: string[], rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`remove_roles${rql}`, { roles });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a list of group permissions
 * @permission Everyone can use this endpoint
 * @returns {PermissionDataList} PermissionDataList
 */
export async function getGroupPermissions(): Promise<PermissionDataList> {
  try {
    return await userServiceClient.get('groups/permissions') as PermissionDataList;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Retrieve a list of group roles
 * @params {string} rql Add filters to the requested list (optional)
 * @params {string} groupId of the targeted group (required)
 * @permission Everyone can use this endpoint
 * @returns {RolesDataList} RolesDataList
 */
export async function getGroupRoles(groupId: string, rql = ''): Promise<RolesDataList> {
  try {
    return await userServiceClient.get(`groups/${groupId}/roles${rql}`) as RolesDataList;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Add a role to a group
 * @params {string} groupId of the targeted group (required)
 * @permission CREATE_GROUP_ROLE | scope:staff_enlistment | Create a role for any group
 * @permission CREATE_GROUP_ROLE | scope:global | Create a role for the group
 * @returns {Role} Role
 */
export async function addRoleToGroup(groupId: string, name: string, description: string): Promise<Role> {
  try {
    return await userServiceClient.post(`groups/${groupId}/roles`, { name, description }) as Role;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Update a group role
 * @params {string} groupId of the targeted group (required)
 * @params {string} roleId of the targeted role (required)
 * @params {string} name of the role (optional)
 * @params {string} description of the role (optional)
 * @permission UPDATE_GROUP_ROLE | scope:staff_enlistment | Update a role for the group
 * @permission UPDATE_GROUP_ROLE | scope:global | Update a role for any group
 * @throws {ResourceUnknownError}
 * @returns {Role} Role
 */
export async function updateGroupRole(groupId: string, roleId: string, name: string, description: string): Promise<Role> {
  try {
    return await userServiceClient.put(`groups/${groupId}/roles/${roleId}`, { name, description }) as Role;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Delete a group role
 * @params {string} groupId of the targeted group (required)
 * @params {string} roleId of the targeted role (required)
 * @params {string} rql Add filters to the requested list (optional)
 * @permission DELETE_GROUP_ROLE | scope:staff_enlistment | Delete a role for the group
 * @permission DELETE_GROUP_ROLE | scope:global | Delete a role from any group
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function deleteGroupRole(groupId: string, roleId: string, rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.delete(`groups/${groupId}/roles/${roleId}${rql}`);
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Add permission to group role
 * @params {string} groupId of the targeted group (required)
 * @params {string} rql Add filters to the requested list (optional)
 * @permission ADD_GROUP_ROLE_PERMISSION | scope:staff_enlistment | Add permissions to roles of the group
 * @permission ADD_GROUP_ROLE_PERMISSION | scope:global | Add permissions to roles of any group
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function addPermissionToGroupRoles(groupId: string, permissions: string[]): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`groups/${groupId}/roles/add_permissions`, { permissions });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Remove permission from group role
 * @params {string} groupId of the targeted group (required)
 * @params {string} rql Add filters to the requested list (required)
 * @permission REMOVE_GROUP_ROLE_PERMISSION | scope:staff_enlistment | Remove permissions from roles of the group
 * @permission REMOVE_GROUP_ROLE_PERMISSION | scope:global | Remove permissions from roles of any group
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function removePermissionFromGroupRoles(groupId: string, permissions: string[], rql: string): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`groups/${groupId}/roles/remove_permissions${rql}`, { permissions });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Assign roles to staff members of a group
 * @params {string} groupId of the targeted group (required)
 * @params {string} rql Add filters to the requested list (optional)
 * @permission ADD_GROUP_ROLE_TO_STAFF | scope:staff_enlistment | Assign roles for the group
 * @permission ADD_GROUP_ROLE_TO_STAFF | scope:global | Assign roles for any group
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function addGroupRoles(groupId: string, roles: string[], rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`groups/${groupId}/staff/add_roles${rql}`, { roles });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Remove roles from staff members of a group
 * @params {string} groupId of the targeted group (required)
 * @params {string} rql Add filters to the requested list (required)
 * @permission REMOVE_GROUP_ROLE_FROM_STAFF | scope:staff_enlistment | Remove roles from staff of the group
 * @permission REMOVE_GROUP_ROLE_FROM_STAFF | scope:global | Remove roles from staff of any group
 * @throws {ResourceUnknownError}
 * @returns {number} affectedRecords
 */
export async function removeGroupRoles(groupId: string, roles: string[], rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`groups/${groupId}/staff/remove_roles${rql}`, { roles });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Add users to staff
 * @params {string} rql Add filters to the requested list (optional)
 * @permission ADD_STAFF | scope:staff_enlistment | Add staff to the group
 * @permission ADD_STAFF | scope:global | Add staff to any group
 * @returns {number} affectedRecords
 */
export async function addUsersToStaff(groups: string[], rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`add_to_staff${rql}`, { groups });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}

/**
 * Remove users from staff
 * @params {string} rql Add filters to the requested list (required)
 * @permission ADD_STAFF | scope:staff_enlistment | Remove staff from the group
 * @permission ADD_STAFF | scope:global | Remove staff from any group
 * @returns {number} affectedRecords
 */
export async function removeUsersFromStaff(groups: string[], rql = ''): Promise<number> {
  try {
    const response: recordsAffectedResponse = await userServiceClient.post(`remove_from_staff${rql}`, { groups });
    return response.recordsAffected;
  } catch (e) {
    throw typeReceivedError(e);
  }
}
