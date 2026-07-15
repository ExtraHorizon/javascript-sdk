import { HttpInstance } from '../../../../http/types';
import { rqlBuilder } from '../../../../rql';
import { addPagersFn, findAllGeneric } from '../../../helpers';
import { HttpClient } from '../../../http-client';
import { OptionsWithRql } from '../../../types';
import { OAuth2Authorization } from '../types';
import { OAuth2AuthorizationsService } from './types';

export default (client: HttpClient, httpWithAuth: HttpInstance): OAuth2AuthorizationsService => {
  async function find(options: OptionsWithRql) {
    const result = await client.get(httpWithAuth, `/oauth2/authorizations${options?.rql || ''}`);
    return result.data;
  }

  return {
    async create(data, options) {
      const result = await client.post(
        httpWithAuth,
        '/oauth2/authorizations',
        data,
        options
      );

      return result.data;
    },

    async find(options) {
      const result = await find(options);
      return addPagersFn(find, options, result);
    },

    async findAll(options) {
      return findAllGeneric<OAuth2Authorization>(find, options);
    },

    async findFirst(options) {
      const result = await find(options);
      return result.data[0];
    },

    async findById(authorizationId, options) {
      const rql = rqlBuilder().eq('id', authorizationId).build();
      return await this.findFirst({ ...options, rql });
    },

    async remove(authorizationId, options) {
      const result = await client.delete(
        httpWithAuth,
        `/oauth2/authorizations/${authorizationId}`,
        options
      );

      return result.data;
    },
  };
};
