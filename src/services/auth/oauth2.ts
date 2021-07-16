import type { HttpInstance } from '../../types';
import type { AuthOauth2Service } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthOauth2Service => ({
  async createAuthorization(data, options) {
    return (
      await client.post(httpWithAuth, `/oauth2/authorizations`, data, options)
    ).data;
  },

  async getAuthorizations(options) {
    return (
      await client.get(
        httpWithAuth,
        `/oauth2/authorizations${options?.rql || ''}`,
        options
      )
    ).data;
  },

  /**
   * Delete an OAuth2 Authorization
   *
   * @permission DELETE_AUTHORIZATIONS | scope:global |	Required for this endpoint
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/delete_oauth2_authorizations__authorizationId_
   * @throws {ResourceUnknownError}
   */
  async deleteAuthorization(authorizationId, options) {
    return (
      await client.delete(
        httpWithAuth,
        `/oauth2/authorizations/${authorizationId}`,
        options
      )
    ).data;
  },
});
