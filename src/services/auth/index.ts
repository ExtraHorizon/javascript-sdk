import type { HttpInstance } from '../../types';
import type {
  ApplicationData,
  ApplicationDataCreation,
  ApplicationDataList,
  ApplicationDataUpdate,
  ApplicationVersionCreationData,
  ApplicationVersionData,
} from './types';
import httpClient from '../http-client';

export default (_http: HttpInstance, httpWithAuth: HttpInstance) => {
  const authClient = httpClient({
    basePath: '/auth/v2',
    // transformRequestData: decamelizeKeys,
  });

  return {
    /**
     * Create an OAuth application
     * @permission CREATE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications
     */
    async createApplication(
      data: ApplicationDataCreation
    ): Promise<ApplicationData> {
      return (await authClient.post(httpWithAuth, '/applications', data)).data;
    },
    /**
     * Create an OAuth application
     * @permission CREATE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/get_applications
     * */
    async getApplications(query?: string): Promise<ApplicationDataList> {
      return (
        await authClient.get(
          httpWithAuth,
          `/applications${query ? `?${query}` : ''}`
        )
      ).data;
    },
    /**
     * Update an OAuth application
     * @permission UPDATE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/put_applications
     * @throws {ResourceUnknownError}
     */
    async updateApplication(
      applicationId: string,
      data: ApplicationDataUpdate
    ): Promise<ApplicationData> {
      return (
        await authClient.put(
          httpWithAuth,
          `/applications/${applicationId}`,
          data
        )
      ).data;
    },
    /**
     * Delete an OAuth application
     * @permission DELETE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId_
     * @throws {ResourceUnknownError}
     */
    async deleteApplication(applicationId: string): Promise<number> {
      return (
        await authClient.delete(httpWithAuth, `/applications/${applicationId}`)
      ).data.affectedRecords;
    },
    /**
     * Create an application version
     * @permission CREATE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications__applicationId__versions
     */
    async createApplicationVersion(
      applicationId: string,
      data: ApplicationVersionCreationData
    ): Promise<ApplicationVersionData> {
      return (
        await authClient.post(
          httpWithAuth,
          `/applications/${applicationId}/versions`,
          data
        )
      ).data;
    },
    /**
     * Delete an OAuth application
     * @permission DELETE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId__versions__versionId_
     * @throws {ResourceUnknownError}
     */
    async deleteApplicationVersion(
      applicationId: string,
      versionId: string
    ): Promise<number> {
      return (
        await authClient.delete(
          httpWithAuth,
          `/applications/${applicationId}/${versionId}`
        )
      ).data.affectedRecords;
    },
  };
};
