import { rqlBuilder } from '../../../rql';
import type { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import type { AuthOauth1Service, AuthOauth1TokenService } from './types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthOauth1Service => ({
  tokens: createTokenService(client, httpWithAuth),

  async generateSsoToken() {
    return (await client.post(httpWithAuth, '/oauth1/ssoTokens/generate', {}))
      .data;
  },

  async consumeSsoToken(ssoToken) {
    return (
      await client.post(httpWithAuth, '/oauth1/ssoTokens/consume', { ssoToken })
    ).data;
  },

  async getTokens(options) {
    return (
      await client.get(
        httpWithAuth,
        `/oauth1/tokens${options?.rql || ''}`,
        options
      )
    ).data;
  },

  async removeToken(tokenId) {
    return (await client.delete(httpWithAuth, `/oauth1/tokens/${tokenId}`))
      .data;
  },
});

function createTokenService(client: HttpClient, httpWithAuth: HttpInstance): AuthOauth1TokenService {
  return {
    async find(options) {
      return (
        await client.get(
          httpWithAuth,
          `/oauth1/tokens${options?.rql || ''}`,
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

    async remove(tokenId) {
      return (await client.delete(httpWithAuth, `/oauth1/tokens/${tokenId}`)).data;
    },
  };
}
