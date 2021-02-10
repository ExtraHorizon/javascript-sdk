import { ApiClient } from '@qompium/oauth1-api-client';
import { camelizeKeys } from 'humps';
import { UserData, UserDataList } from './models';

const userServiceClient = new ApiClient('users', 'v1');
/**
 * Retrieve the current logged in user.
 * @permission Everyone can use this endpoint
 * @returns {UserData} UserData
 */
export async function getMe(): Promise<UserData> {
  const response = await userServiceClient.get('me');
  const user: UserData = camelizeKeys(response) as any;
  return user;
}

/**
 * Retrieve a list of users.
 * @permission See a subset of fields from all staff members of groups where you have a patient enlistment
 * @permission --------- | scope:group  | See a subset of fields from all patients of the group
 * @permission VIEW_USER | scope:global | See all fields of all users
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getUsers(rql = ''):Promise<UserDataList> {
  const response = await userServiceClient.get(rql);
  const userList: UserDataList = camelizeKeys(response) as any;
  return userList;
}

/**
 * Retrieve a list of users that have a patient enlistment.
 * @permission --------- | scope:group  | View the patients of the group
 * @permission VIEW_PATIENTS | scope:global | View all patients
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getPatients(rql = ''):Promise<UserDataList> {
  const response = await userServiceClient.get(`patients/${rql}`);
  const patientsList: UserDataList = camelizeKeys(response) as any;
  return patientsList;
}

/**
 * Retrieve a list of users that have a staff enlistment.
 * @permission --------- | scope:group  | View the other staff members of the group
 * @permission VIEW_STAFF | scope:global | View all staff members
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getStaff(rql = ''):Promise<UserDataList> {
  const response = await userServiceClient.get(`staff/${rql}`);
  const staffList: UserDataList = camelizeKeys(response) as any;
  return staffList;
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
export async function getUserById(userId:string): Promise<UserData> {
  const response = await userServiceClient.get(userId);
  const user: UserData = camelizeKeys(response) as any;
  return user;
}

/**
 * Update a specific user.
 * @permission Update your own data
 * @permission UPDATE_USER | scope:global | Update any user
 * @params {string} userId Id of the targeted user (required)
 * @body Fields to update
 * @returns {UserData} UserData
 */
export async function updateUser(userId:string, data:any): Promise<UserData> {
  const response = await userServiceClient.put(userId, data);
  const user: UserData = camelizeKeys(response) as any;
  return user;
}
