import { HttpInstance } from '../../../../http/types';
import { rqlBuilder } from '../../../../rql';
import { addPagersFn, findAllGeneric } from '../../../helpers';
import { HttpClient } from '../../../http-client';
import { OAuth2RefreshToken, OAuth2RefreshTokenService } from './types';

export default (client: HttpClient, httpWithAuth: HttpInstance): OAuth2RefreshTokenService => {
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
      return await findAllGeneric(find, options);
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
};
