import { rqlBuilder } from '../../../rql';
import type { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import type { AuthOauth2Service, AuthOauth2TokenService } from './types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthOauth2Service => ({
  tokens: createTokenService(client, httpWithAuth),

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

function createTokenService(
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthOauth2TokenService {
  return {
    async find(options) {
      return (
        await client.get(
          httpWithAuth,
          `/oauth2/tokens${options?.rql || ''}`,
          options
        )
      ).data;
    },

    async findFirst(options) {
      const res = await this.find(options);
      return res.data[0];
    },

    async findById(id, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
      return await this.findFirst({ ...options, rql: rqlWithId });
    },

    async remove(id) {
      return (await client.delete(httpWithAuth, `/oauth2/tokens/${id}`)).data;
    },
  };
}
