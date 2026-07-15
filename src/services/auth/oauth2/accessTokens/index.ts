import { HttpInstance } from '../../../../http/types';
import { rqlBuilder } from '../../../../rql';
import { findAllGeneric } from '../../../helpers';
import { HttpClient } from '../../../http-client';
import { AuthOauth2TokenService } from './types';

export default (client: HttpClient, httpWithAuth: HttpInstance): AuthOauth2TokenService => ({
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
});
