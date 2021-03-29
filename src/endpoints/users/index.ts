import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { decamelizeKeys } from 'humps';
import { UserData } from './types';
import { resultResponse, Results } from '../../models';

export default (
  http: AxiosInstance,
  httpWithAuth: AxiosInstance,
  apiVersion = 1
) => {
  const BASE_PATH = `/users/v${apiVersion}`;

  const get = (axios, path, config?: AxiosRequestConfig) =>
    axios.get(`${BASE_PATH}${path}`, config);

  const put = (axios, path, data) =>
    axios.put(`${BASE_PATH}${path}`, decamelizeKeys(data));

  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async function getHealth(): Promise<boolean> {
    const result: resultResponse = await get(http, '/health');
    return result.status === Results.Success;
  }

  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  async function getMe(): Promise<UserData> {
    return (await get(httpWithAuth, '/me', {})).data;
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
  async function getById(userId: string): Promise<UserData> {
    return (await get(httpWithAuth, `/${userId}`)).data;
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
  async function putUserId(userId: string, data: any): Promise<UserData> {
    return (await put(httpWithAuth, `/${userId}`, data)).data;
  }

  return {
    getHealth,
    getMe,
    getById,
    putUserId,
  };
};
