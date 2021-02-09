import { ApiClient } from '@qompium/oauth1-api-client';
import { camelizeKeys } from 'humps';
import { apiConfig } from '../config';
import { UserData } from './models';

const userServiceClient = new ApiClient('users', 'v1', apiConfig);
/**
 * Retrieve the current logged in user.
 * @permission Everyone can use this endpoint
 * @returns {UserData} UserData object
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
 * @param {string} rql Add filters to the requested list(optional)
 * @returns {UserData} UserData - list
 */
export async function list(rql?:string) {
  const response = await userServiceClient.list(rql);

  return response;
}

/**
 * Retrieve a list of users.
 * @permission See a subset of fields from all staff members of groups where you have a patient enlistment
 * @permission
 * @param {string} rql Add filters to the requested list
 * @returns {UserData} list UserData
 */
export function patients(rql:string) {
  console.log(rql);
}
