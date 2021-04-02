import type { HttpInstance } from '../../types';
import type {
  ApplicationData,
  ApplicationDataCreation,
  ApplicationDataList,
  ApplicationDataUpdate,
} from './types';
import httpClient from '../http-client';

export default (_http: HttpInstance, httpWithAuth: HttpInstance) => {
  const authClient = httpClient({
    basePath: '/auth/v2',
    // transformRequestData: decamelizeKeys,
  });

  /**
   * Create an OAuth application
   * @permission CREATE_APPLICATIONS | scope:global |
   * @params {ApplicationDataCreation}
   * @returns {Promise<ApplicationData>}
   */
  async function createApplication(
    data: ApplicationDataCreation
  ): Promise<ApplicationData> {
    return (await authClient.post(httpWithAuth, '/applications', data)).data;
  }

  /**
   * Create an OAuth application
   * @permission CREATE_APPLICATIONS | scope:global |
   * @params {ApplicationDataCreation}
   * @returns {Promise<ApplicationDataList>}
   */
  async function getApplications(query?: string): Promise<ApplicationDataList> {
    return (
      await authClient.get(
        httpWithAuth,
        `/applications${query ? `?${query}` : ''}`
      )
    ).data;
  }

  async function updateApplication(
    applicationId: string,
    data: ApplicationDataUpdate
  ): Promise<ApplicationData> {
    return (
      await authClient.post(
        httpWithAuth,
        `/applications/${applicationId}`,
        data
      )
    ).data;
  }

  return {
    createApplication,
    getApplications,
    updateApplication,
  };
};
