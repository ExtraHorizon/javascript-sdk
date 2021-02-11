import { ApiClient } from '../oauth1-api';
import { RegisterUserData, UserData, UserDataList } from './models';
import { recordsAffectedResponse } from '../models';

const userServiceClient = new ApiClient('users', 'v1');
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
export async function getList(rql = ''):Promise<UserDataList> {
  return await userServiceClient.get(rql) as UserDataList;
}

/**
 * Retrieve a list of users that have a patient enlistment.
 * @permission --------- | scope:group  | View the patients of the group
 * @permission VIEW_PATIENTS | scope:global | View all patients
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getPatients(rql = ''):Promise<UserDataList> {
  return await userServiceClient.get(`patients/${rql}`) as UserDataList;
}

/**
 * Retrieve a list of users that have a staff enlistment.
 * @permission --------- | scope:group  | View the other staff members of the group
 * @permission VIEW_STAFF | scope:global | View all staff members
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getStaff(rql = ''):Promise<UserDataList> {
  return await userServiceClient.get(`staff/${rql}`) as UserDataList;
}

/**
 * Retrieve a specific user.
 * @permission See your own user object
 * @permission --------- | scope:group  | See a subset of the fields for any staff member or patient of the group
 * @permission VIEW_PATIENTS | scope:global | See a subset of fields for any user with a patient enlistment
 * @permission VIEW_STAFF | scope:global | See a subset of fields for any user with a staff enlistment
 * @permission VIEW_USER | scope:global | See any user object
 * @params {string} userId Id of the targeted user (required)
 * @returns {UserData} UserData
 */
export async function getById(userId:string): Promise<UserData> {
  return await userServiceClient.get(userId) as UserData;
}

/**
 * Update a specific user.
 * @permission Update your own data
 * @permission UPDATE_USER | scope:global | Update any user
 * @params {string} userId Id of the targeted user (required)
 * @params {any} data Fields to update
 * @returns {UserData} UserData
 */
export async function update(userId:string, data:any): Promise<UserData> {
  return await userServiceClient.put(userId, data) as UserData;
}

/**
 * Delete a specific user
 * @permission Delete your own user object
 * @permission DELETE_USER | scope:global | Delete any user
 * @params {string} userId Id of the targeted user (required)
 * @returns {boolean} success
 */
export async function remove(userId:string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.delete(userId);
  return response.recordsAffected === 1;
}

/**
 * Update the email address of a specific user.
 * An email is send to validate and activate the new address.
 * @permission Update your own data
 * @permission UPDATE_USER_EMAIL | scope:global | Update any user
 * @params {string} userId Id of the targeted user (required)
 * @params {string} email
 * @returns {UserData} UserData
 */
export async function updateEmail(userId:string, email:string): Promise<UserData> {
  return await userServiceClient.put(`${userId}/email`, { email }) as UserData;
}

/**
 * Add a patient enlistment to a user.
 * @permission ADD_PATIENT | scope:global | Add any patient enlistment
 * @params {string} userId Id of the targeted user (required)
 * @params {string} groupId Id of the targeted group (required)
 * @returns {boolean} success
 */
export async function addPatientEnlistment(userId:string, groupId:string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.post(`${userId}/patient_enlistments`, { groupId });
  return response.recordsAffected === 1;
}

/**
 * Remove a patient enlistment from a user.
 * @permission Remove a patient enlistment from yourself
 * @permission REMOVE_PATIENT | scope:group | Remove a patient enlistment for the group
 * @permission REMOVE_PATIENT | scope:global | Remove any patient enlistment
 * @params {string} userId Id of the targeted user (required)
 * @params {string} groupId Id of the targeted group (required)
 * @returns {boolean} success
 */
export async function deletePatientEnlistment(userId:string, groupId:string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.delete(`${userId}/patient_enlistments/${groupId}`);
  return response.recordsAffected === 1;
}

/**
 * Create an account.
 * @permission Everyone can use this endpoint
 * @params {RegisterUserData} registerData Data necessary to register (required)
 * @returns {UserData} UserData
 */
export async function register(data:RegisterUserData): Promise<UserData> {
  return await userServiceClient.post('register', data) as UserData;
}
