import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import type {
  Application,
  ApplicationCreation,
  ApplicationUpdate,
  ApplicationVersionCreation,
  ApplicationVersion,
} from './types';
import { RQLString } from '../../rql';

export default (client, httpWithAuth: HttpInstance) => ({
  /**
   * Create an OAuth application
   *
   * @permission CREATE_APPLICATIONS | scope:global |
   * @async
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications
   */
  async create(data: ApplicationCreation): Promise<Application> {
    return (await client.post(httpWithAuth, '/applications', data)).data;
  },

  /**
   * Get a list of applications
   * @permission VIEW_APPLICATIONS | scope:global |
   * @async
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/get_applications
   * */
  async get(options?: { rql?: RQLString }): Promise<PagedResult<Application>> {
    return (
      await client.get(httpWithAuth, `/applications${options?.rql || ''}`)
    ).data;
  },

  /**
   * Update an OAuth application
   *
   * @permission UPDATE_APPLICATIONS | scope:global |
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/put_applications
   * @throws {ResourceUnknownError}
   */
  async update(
    applicationId: string,
    data: ApplicationUpdate
  ): Promise<Application> {
    return (
      await client.put(httpWithAuth, `/applications/${applicationId}`, data)
    ).data;
  },

  /**
   * Delete an OAuth application
   *
   * @permission DELETE_APPLICATIONS | scope:global |
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId_
   * @throws {ResourceUnknownError}
   */
  async delete(applicationId: string): Promise<AffectedRecords> {
    return (await client.delete(httpWithAuth, `/applications/${applicationId}`))
      .data;
  },

  /**
   * Create an application version
   *
   * @permission CREATE_APPLICATIONS | scope:global | Required for this endpoint
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications__applicationId__versions
   */
  async createVersion(
    applicationId: string,
    data: ApplicationVersionCreation
  ): Promise<ApplicationVersion> {
    return (
      await client.post(
        httpWithAuth,
        `/applications/${applicationId}/versions`,
        data
      )
    ).data;
  },

  /**
   * Delete an application version
   *
   * @permission DELETE_APPLICATIONS | scope:global | Required for this endpoint
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId__versions__versionId_
   * @throws {ResourceUnknownError}
   */
  async deleteVersion(
    applicationId: string,
    versionId: string
  ): Promise<AffectedRecords> {
    return (
      await client.delete(
        httpWithAuth,
        `/applications/${applicationId}/${versionId}`
      )
    ).data;
  },
});
