import { AxiosInstance } from 'axios';
import { UserData } from './types';
import { resultResponse, Results } from '../../models';
import { toCamelCase } from '../../utils';

export default (
  http: AxiosInstance,
  httpWithAuth: AxiosInstance,
  apiVersion = 1
) => {
  const getPath = url => `/users/v${apiVersion}${url}`;

  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async function getHealth(): Promise<boolean> {
    const result: resultResponse = await http.get(getPath('/health'));
    return result.status === Results.Success;
  }

  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  async function getMe(): Promise<UserData> {
    const user = await httpWithAuth.get(getPath('/me'));
    return toCamelCase(user.data);
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
    const user = await httpWithAuth.get(getPath(`/${userId}`));
    return toCamelCase(user.data);
  }

  return {
    getHealth,
    getMe,
    getById,
  };
};
