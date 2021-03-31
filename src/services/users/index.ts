import { decamelizeKeys } from 'humps';
import type { HttpInstance } from '../../types';
import type { UserData } from './types';
import { resultResponse, Results } from '../../models';
import httpClient from '../http-client';

export default (http: HttpInstance, httpWithAuth: HttpInstance) => {
  const wrappedHttp = httpClient({
    basePath: '/users/v1',
    transformRequestData: decamelizeKeys,
  });
  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async function health(): Promise<boolean> {
    const result: resultResponse = await wrappedHttp.get(http, '/health');
    return result.status === Results.Success;
  }

  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  async function me(): Promise<Partial<UserData>> {
    return (await wrappedHttp.get(httpWithAuth, '/me')).data;
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
  async function findById(userId: string): Promise<Partial<UserData>> {
    return (await wrappedHttp.get(httpWithAuth, `/${userId}`)).data;
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
  async function update(userId: string, userData: Pick<UserData,
    'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'
  >): Promise<UserData> {
    return (await wrappedHttp.put(httpWithAuth, `/${userId}`, userData)).data;
  }

  return {
    health,
    me,
    findById,
    update,
  };
};
