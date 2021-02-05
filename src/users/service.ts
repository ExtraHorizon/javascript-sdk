import { UserData } from "../models";

/**
 * Retrieve the current logged in user.
 * @permission Everyone can use this endpoint
 * @returns {UserData} UserData
 */
export function getMe(): UserData {
  return { id: 'hqhsdf', first_name: 'Peace', last_name: 'P' };
}

/**
 * Retrieve a list of users.
 * @permission See a subset of fields from all staff members of groups where you have a patient enlistment
 * @permission
 * @param {string} rql Add filters to the requested list
 * @returns {UserData} list UserData
 */
export function list(rql:string): UserData {
  console.log(rql);
}

/**
 * Retrieve a list of users.
 * @permission See a subset of fields from all staff members of groups where you have a patient enlistment
 * @permission
 * @param {string} rql Add filters to the requested list
 * @returns {UserData} list UserData
 */
export function patients(rql:string): UserData {
  console.log(rql);
}
