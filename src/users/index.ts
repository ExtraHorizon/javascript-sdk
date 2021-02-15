import { ApiClient } from '../oauth1-api';
import { RegisterUserData, UserData, UserDataList, PermissionDataList, RolesDataList, Role } from './models';
import { recordsAffectedResponse, resultResponse, Results, recordsAffectedResponseSnake } from '../models';

const userServiceClient = new ApiClient('users', 'v1');

/**
 * Perform a health check
 * @permission Everyone can use this endpoint
 * @returns {boolean} success
 */
export async function getHealth(): Promise<boolean> {
  const result: resultResponse = await userServiceClient.get('health');
  return result.status === Results.Success;
}

/**
 * Retrieve the current logged in user.
 * @permission Everyone can use this endpoint
 * @returns {UserData} UserData
 */
export async function getCurrent(): Promise<UserData> {
  return await userServiceClient.get('me') as UserData;
}

/**
 * Retrieve a list of users.
 * @permission See a subset of fields from all staff members of groups where you have a patient enlistment
 * @permission --------- | scope:group  | See a subset of fields from all patients of the group
 * @permission VIEW_USER | scope:global | See all fields of all users
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getList(rql = ''): Promise<UserDataList> {
  return await userServiceClient.get(rql) as UserDataList;
}

/**
 * Retrieve a list of users that have a patient enlistment.
 * @permission --------- | scope:group  | View the patients of the group
 * @permission VIEW_PATIENTS | scope:global | View all patients
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getPatients(rql = ''): Promise<UserDataList> {
  return await userServiceClient.get(`patients/${rql}`) as UserDataList;
}

/**
 * Retrieve a list of users that have a staff enlistment.
 * @permission --------- | scope:group  | View the other staff members of the group
 * @permission VIEW_STAFF | scope:global | View all staff members
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getStaff(rql = ''): Promise<UserDataList> {
  return await userServiceClient.get(`staff/${rql}`) as UserDataList;
}

/**
 * Retrieve a specific user.
 * @permission See your own user object
 * @permission --------- | scope:group  | See a subset of the fields for any staff member or patient of the group
 * @permission VIEW_PATIENTS | scope:global | See a subset of fields for any user with a patient enlistment
 * @permission VIEW_STAFF | scope:global | See a subset of fields for any user with a staff enlistment
 * @permission VIEW_USER | scope:global | See any user object
 * @params {string} userId of the targeted user (required)
 * @throws 404 {ResourceUnknownException}
 * @returns {UserData} UserData
 */
export async function getById(userId: string): Promise<UserData> {
  return await userServiceClient.get(userId) as UserData;
}

/**
 * Update a specific user.
 * @permission Update your own data
 * @permission UPDATE_USER | scope:global | Update any user
 * @params {string} userId of the targeted user (required)
 * @params {any} data Fields to update
 * @throws 404 {ResourceUnknownException}
 * @returns {UserData} UserData
 */
export async function update(userId: string, data: any): Promise<UserData> {
  return await userServiceClient.put(userId, data) as UserData;
}

/**
 * Delete a specific user
 * @permission Delete your own user object
 * @permission DELETE_USER | scope:global | Delete any user
 * @params {string} userId of the targeted user (required)
 * @throws 404 {ResourceUnknownException}
 * @returns {boolean} success
 */
export async function remove(userId: string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.delete(userId);
  return response.recordsAffected === 1;
}

/**
 * Update the email address of a specific user.
 * An email is send to validate and activate the new address.
 * @permission Update your own data
 * @permission UPDATE_USER_EMAIL | scope:global | Update any user
 * @params {string} userId of the targeted user (required)
 * @params {string} email
 * @throws 400 {EmailUsedException}
 * @throws 404 {ResourceUnknownException}
 * @returns {UserData} UserData
 */
export async function updateEmail(userId: string, email: string): Promise<UserData> {
  return await userServiceClient.put(`${userId}/email`, { email }) as UserData;
}

/**
 * Add a patient enlistment to a user.
 * @permission ADD_PATIENT | scope:global | Add any patient enlistment
 * @params {string} userId of the targeted user (required)
 * @params {string} groupId of the targeted group (required)
 * @throws 400 {ResourceAlreadyExistsException}
 * @returns {boolean} success
 */
export async function addPatientEnlistment(userId: string, groupId: string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.post(`${userId}/patient_enlistments`, { groupId });
  return response.recordsAffected === 1;
}

/**
 * Remove a patient enlistment from a user.
 * @permission Remove a patient enlistment from yourself
 * @permission REMOVE_PATIENT | scope:group | Remove a patient enlistment for the group
 * @permission REMOVE_PATIENT | scope:global | Remove any patient enlistment
 * @params {string} userId of the targeted user (required)
 * @params {string} groupId of the targeted group (required)
 * @throws 404 {ResourceUnknownException}
 * @returns {boolean} success
 */
export async function deletePatientEnlistment(userId: string, groupId: string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.delete(`${userId}/patient_enlistments/${groupId}`);
  return response.recordsAffected === 1;
}

/**
 * Create an account.
 * @permission Everyone can use this endpoint
 * @params {RegisterUserData} registerData Data necessary to register (required)
 * @returns {UserData} UserData
 * @throws 400 {EmailUsedException}
 */
export async function register(data: RegisterUserData): Promise<UserData> {
  return await userServiceClient.post('register', data) as UserData;
}

/**
 * Change your password..
 * @permission Everyone can use this endpoint
 * @params {string} Old password (required)
 * @params {string} New password (required)
 * @throws 400 {PasswordException}
 * @returns {boolean} success
 */
export async function updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.put('password', { oldPassword, newPassword });
  return result.status === Results.Success;
}

/**
 * Authenticate a user.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @params {string} password (required)
 * @throws 401 {AuthenticationException}
 * @throws 401 {LoginTimeoutException}
 * @throws 401 {LoginFreezeException}
 * @throws 401 {TooManyFailedAttemptsException}
 * @returns {UserData} UserData
 */
export async function authenticate(email: string, password: string): Promise<UserData> {
  return await userServiceClient.post('authenticate', { email, password }) as UserData;
}

/**
 * Request an email activation.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @returns {boolean} success
 * @throws 400: {EmailUnknownException}
 * @throws 400: {AlreadyActivatedException}
 */
export async function requestActivationMail(email: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.get(`activation?email=${email}`);
  return result.status === Results.Success;
}

/**
 * Complete an email activation
 * @permission Everyone can use this endpoint
 * @params {string} hash (required)
 * @throws 400: {ActivationUnknownException}
 * @returns {boolean} success
 */
export async function completeActivationMail(hash: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.post('activation', { hash });
  return result.status === Results.Success;
}

/**
 * Request a password reset.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @throws 400: {EmailUnknownException}
 * @throws 400: {NotActivatedException}
 * @returns {boolean} success
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.get(`forgot_password?email=${email}`);
  return result.status === Results.Success;
}

/**
 * Complete a password reset..
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @params {string} new password (required)
 * @throws 400: {NotActivatedException}
 * @throws 400: {NewPasswordHashUnknownException}
 * @returns {boolean} success
 */
export async function completePasswordReset(hash: string, newPassword: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.post('forgot_password', { hash, newPassword });
  return result.status === Results.Success;
}

/**
 * Confirm the password for the user making the request
 * @permission Everyone can use this endpoint
 * @params {string} password (required)
 * @throws 401 {AuthenticationException}
 * @throws 401 {LoginTimeoutException}
 * @throws 401 {LoginFreezeException}
 * @throws 401 {TooManyFailedAttemptsException}
 * @returns {boolean} success
 */
export async function confirmPassword(password: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.post('confirm_password', { password });
  return result.status === Results.Success;
}

/**
 * Check if an email address is still available.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @returns {boolean} success
 */
export async function emailAvailable(email: string): Promise<boolean> {
  const result = await userServiceClient.get(`email_available?email=${email}`);
  return result.emailAvailable;
}

/**
 * Retrieve a list of global permissions.
 * @permission Everyone can use this endpoint
 * @returns {PermissionDataList} PermissionDataList
 */
export async function getGlobalPermissions(): Promise<PermissionDataList> {
  return await userServiceClient.get('permissions') as PermissionDataList;
}

/**
 * Retrieve a list of global roles.
 * @permission Everyone can use this endpoint
 * @returns {RolesDataList} RolesDataList
 */
export async function getGlobalRoles(rql = ''): Promise<RolesDataList> {
  return await userServiceClient.get(`roles${rql}`) as RolesDataList;
}

/**
 * Create a global role.
 * @permission CREATE_ROLE | scope:global | Create all roles
 * @params {RegisterUserData} registerData Data necessary to register (required)
 * @returns {Role} Role
 */
export async function createGlobalRole(rql = ''): Promise<Role> {
  return await userServiceClient.post(`roles/${rql}`) as Role;
}

/**
 * Delete a global role.
 * @permission Delete your own user object
 * @permission DELETE_ROLE | scope:global | Delete any user
 * @params {string} userId of the targeted user (required)
 * @throws 404 {ResourceUnknownException}
 * @returns {boolean} success
 */
export async function removeGlobalRole(rql = ''): Promise<boolean> {
  const response: recordsAffectedResponseSnake = await userServiceClient.delete(`roles/${rql}`);
  return response.records_affected === 1;
}

/**
 * Add a role.
 * @permission Update roles
 * @permission UPDATE_ROLE | scope:global | Update any role
 * @returns {Role} Role
 */
export async function updateGlobalRole(roleId: string): Promise<Role> {
  return await userServiceClient.put(`roles/${roleId}`) as Role;
}

/**
 * Add global roles from permission.
 * @permission Add your own roles
 * @permission ADD_ROLE_PERMISSIONS | scope:global | Add permission to a role
 * @params {string} roleId (required)
 * @throws 404 {ResourceUnknownException}
 * @returns {Role} Role
 */
export async function addPermissionToGlobalRoles(): Promise<Role> {
  return await userServiceClient.post(`roles/add_permissions`) as Role;
}

/**
 * Add global roles from permission.
 * @permission Remove your own roles
 * @permission REMOVE_ROLE_PERMISSIONS | scope:global | Remove permission from role
 * @params {string} roleId (required)
 * @throws 404 {ResourceUnknownException}
 * @returns {Role} Role
 */
export async function removePermissionFromGlobalRoles(rql = ''): Promise<Role> {
  return await userServiceClient.post(`roles/remove_permissions/${rql}`) as Role;
}

/**
 * Add global roles.
 * @permission Add your own roles
 * @permission ADD_ROLE_PERMISSIONS | scope:global | Add any global role to the user
 * @params {string} roleId (required)
 * @returns {Role} Role
 */
export async function addPermissionGlobalPermissions(rql = ''): Promise<Role> {
  return await userServiceClient.post(`roles/add_roles/${rql}`) as Role;
}

/**
 * Remove global roles.
 * @permission Remove your own roles
 * @permission REMOVE_ROLE_FROM_USER | scope:global | Remove any global role from user
 * @params {string} roleId (required)
 * @returns {Role} Role
 */
export async function removePermissionGlobalPermissions(rql = ''): Promise<boolean> {
  const response: recordsAffectedResponseSnake = await userServiceClient.post(`roles/remove_roles/${rql}`) as Role;
  return response.records_affected === 1;
}



