import { rqlBuilder } from '../../../rql';
import { HttpInstance, OAuth2RefreshToken, OAuth2RefreshTokenService } from '../../../types';
import { addPagersFn, findAllGeneric } from '../../helpers';
import { HttpClient } from '../../http-client';
import type { AuthOauth2Service, AuthOauth2TokenService } from './types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthOauth2Service => ({
  tokens: createTokenService(client, httpWithAuth),
  refreshTokens: createRefreshTokenService(client, httpWithAuth),

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

    async findAll(options) {
      return await findAllGeneric(this.find, options);
    },

    async remove(id) {
      return (await client.delete(httpWithAuth, `/oauth2/tokens/${id}`)).data;
    },
  };
}

function createRefreshTokenService(client: HttpClient, httpWithAuth: HttpInstance): OAuth2RefreshTokenService {
  async function find(options) {
    const result = await client.get(
      httpWithAuth,
      `/oauth2/refreshTokens${options?.rql || ''}`,
      options
    );

    return result.data;
  }

  return {
    async find(options) {
      const result = await find(options);
      return addPagersFn<OAuth2RefreshToken>(find, options, result);
    },

    async findAll(options) {
      return await findAllGeneric(this.find, options);
    },

    async findFirst(options) {
      const result = await find(options);
      return result.data[0];
    },

    async findById(id, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
      const result = await find({ ...options, rql: rqlWithId });
      return result.data[0];
    },

    async remove(id, options) {
      const result = (
        await client.delete(
          httpWithAuth,
          `/oauth2/refreshTokens/${id}`,
          options
        )
      );

      return result.data;
    },
  };
}
