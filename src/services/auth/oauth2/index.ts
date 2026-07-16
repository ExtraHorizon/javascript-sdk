import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import accessTokens from './accessTokens';
import authorizations from './authorizations';
import refreshTokens from './refreshTokens';
import type { AuthOauth2Service } from './types';

export default (client: HttpClient, httpWithAuth: HttpInstance): AuthOauth2Service => ({
  tokens: accessTokens(client, httpWithAuth),
  refreshTokens: refreshTokens(client, httpWithAuth),
  authorizations: authorizations(client, httpWithAuth),

  async createAuthorization(data, options) {
    return (
      await client.post(httpWithAuth, '/oauth2/authorizations', data, options)
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
