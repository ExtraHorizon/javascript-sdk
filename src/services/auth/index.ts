import type { HttpInstance } from '../../types';
import type {
  Application,
  ApplicationCreation,
  ApplicationList,
  ApplicationUpdate,
  ApplicationVersionCreation,
  ApplicationVersion,
  OAuth2Authorization,
  OAuth2AuthorizationCreation,
  OAuth2AuthorizationList,
} from './types';
import httpClient from '../http-client';
import { affectedRecordsResponse } from '../../models';

export default (_http: HttpInstance, httpWithAuth: HttpInstance) => {
  const authClient = httpClient({
    basePath: '/auth/v2',
  });

  return {
    /**
     * Create an OAuth application
     * @permission CREATE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications
     */
    async createApplication(data: ApplicationCreation): Promise<Application> {
      return (await authClient.post(httpWithAuth, '/applications', data)).data;
    },
    /**
     * Create an OAuth application
     * @permission VIEW_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/get_applications
     * */
    async getApplications(query?: string): Promise<ApplicationList> {
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
      data: ApplicationUpdate
    ): Promise<Application> {
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
      data: ApplicationVersionCreation
    ): Promise<ApplicationVersion> {
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
    ): Promise<affectedRecordsResponse> {
      return (
        await authClient.delete(
          httpWithAuth,
          `/applications/${applicationId}/${versionId}`
        )
      ).data;
    },

    /**
     * Create an OAuth2 authorization
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/post_oauth2_authorizations
     * @throws {ApplicationUnknownError}
     * @throws {CallbackNotValidError}
     * @throws {UnsupportedResponseTypeError}
     */
    async createOauth2Authorization(
      data: OAuth2AuthorizationCreation
    ): Promise<OAuth2Authorization> {
      return (
        await authClient.post(httpWithAuth, `/oauth2/authorizations`, data)
      ).data;
    },

    /**
     * Get a list of OAuth2 Authorizations
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/get_oauth2_authorizations
     * @permission VIEW_AUTHORIZATIONS | scope:global |
     */
    async getOauth2Authorizations(
      query?: string
    ): Promise<OAuth2AuthorizationList> {
      return (
        await authClient.get(
          httpWithAuth,
          `/oauth2/authorizations${query ? `?${query}` : ''}`
        )
      ).data;
    },

    /**
     * Delete an OAuth2 Authorization
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/get_oauth2_authorizations
     * @permission DELETE_AUTHORIZATIONS | scope:global |
     */
    async deleteOauth2Authorization(
      authorizationId: string
    ): Promise<affectedRecordsResponse> {
      return (
        await authClient.delete(
          httpWithAuth,
          `/oauth2/authorizations/${authorizationId}`
        )
      ).data;
    },
  };
};
