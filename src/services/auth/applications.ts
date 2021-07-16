import type { HttpInstance } from '../../types';
import type { AuthApplicationsService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthApplicationsService => ({
  async create(data, options) {
    return (await client.post(httpWithAuth, '/applications', data, options))
      .data;
  },

  async get(options) {
    return (
      await client.get(
        httpWithAuth,
        `/applications${options?.rql || ''}`,
        options
      )
    ).data;
  },

  async update(applicationId, data, options) {
    return (
      await client.put(
        httpWithAuth,
        `/applications/${applicationId}`,
        data,
        options
      )
    ).data;
  },

  async remove(applicationId, options) {
    return (
      await client.delete(
        httpWithAuth,
        `/applications/${applicationId}`,
        options
      )
    ).data;
  },

  async createVersion(applicationId, data, options) {
    return (
      await client.post(
        httpWithAuth,
        `/applications/${applicationId}/versions`,
        data,
        options
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
  async deleteVersion(applicationId, versionId, options) {
    return (
      await client.delete(
        httpWithAuth,
        `/applications/${applicationId}/${versionId}`,
        options
      )
    ).data;
  },
});
