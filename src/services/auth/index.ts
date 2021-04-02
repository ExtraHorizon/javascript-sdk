import type { HttpInstance } from '../../types';
import type { ApplicationData, ApplicationDataCreation } from './types';
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
   * @returns {ApplicationData}
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
   * @returns {ApplicationData}
   */
  async function getApplications(
    query?: string
  ): Promise<Array<ApplicationData>> {
    return (
      await authClient.get(
        httpWithAuth,
        `/applications${query ? `?${query}` : ''}`
      )
    ).data;
  }

  return {
    createApplication,
    getApplications,
  };
};
