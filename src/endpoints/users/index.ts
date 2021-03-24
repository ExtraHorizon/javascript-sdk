import { AxiosInstance } from 'axios';
import { UserData } from './types';
import { resultResponse, Results } from '../../models';
import { typeReceivedError } from '../../errorHandler';

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
    try {
      const result: resultResponse = await http.get(getPath('/health'));
      // const result: resultResponse = await http.get(`${USER_BASE}/health`);

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
  async function getMe(): Promise<UserData> {
    return (await httpWithAuth.get(getPath('/me'))).data;
  }

  return {
    getHealth,
    getMe,
  };
};
