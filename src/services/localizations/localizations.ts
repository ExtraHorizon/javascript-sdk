import type { HttpInstance } from '../../types';
import { rqlBuilder } from '../../rql';
import type { LocalizationsService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): LocalizationsService => ({
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  },

  async findByKey(this: LocalizationsService, key, options) {
    const rqlWithKey = rqlBuilder(options?.rql).eq('key', key).build();
    const res = await this.find({ ...options, rql: rqlWithKey });
    return res.data[0];
  },

  async findFirst(this: LocalizationsService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (await client.post(httpAuth, '/', requestBody, options)).data;
  },

  async update(requestBody, options) {
    return (await client.put(httpAuth, '/', requestBody, options)).data;
  },

  async remove(rql, options) {
    return (await client.delete(httpAuth, `/${rql || ''}`, options)).data;
  },

  async getByKeys(requestBody, options) {
    return (await client.post(httpAuth, '/request', requestBody, options)).data;
  },
});
