import type { HttpInstance } from '../../types';
import { AffectedRecords, PagedResult } from '../types';
import type { OAuth2Authorization, OAuth2AuthorizationCreation } from './types';
import { RQLString } from '../../rql';

export default (client, httpWithAuth: HttpInstance) => ({
  /**
   * Create an OAuth2 authorization
   *
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/post_oauth2_authorizations
   * @throws {ApplicationUnknownError}
   * @throws {CallbackNotValidError}
   * @throws {UnsupportedResponseTypeError}
   */
  async createAuthorization(
    data: OAuth2AuthorizationCreation
  ): Promise<OAuth2Authorization> {
    return (await client.post(httpWithAuth, `/oauth2/authorizations`, data))
      .data;
  },

  /**
   * Get a list of OAuth2 Authorizations
   *
   * @permission VIEW_AUTHORIZATIONS | scope:global | Required for this endpoint
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/get_oauth2_authorizations
   */
  async getAuthorizations(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<OAuth2Authorization>> {
    return (
      await client.get(
        httpWithAuth,
        `/oauth2/authorizations${options?.rql || ''}`
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
  async deleteAuthorization(authorizationId: string): Promise<AffectedRecords> {
    return (
      await client.delete(
        httpWithAuth,
        `/oauth2/authorizations/${authorizationId}`
      )
    ).data;
  },
});
