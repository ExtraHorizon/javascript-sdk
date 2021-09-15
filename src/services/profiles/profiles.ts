import type { HttpInstance } from '../../types';
import { rqlBuilder } from '../../rql';
import { ProfilesService, Profile } from './types';
import { HttpClient } from '../http-client';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ProfilesService => ({
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  },

  async findAll(this: ProfilesService, options) {
    return findAllGeneric<Profile>(this.find, options);
  },

  findAllIterator(this: ProfilesService, options) {
    return findAllIterator<Profile>(this.find, options);
  },

  async findById(this: ProfilesService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: ProfilesService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (await client.post(httpAuth, '/', requestBody, options)).data;
  },

  async update(rql, requestBody, options) {
    return (await client.put(httpAuth, `/${rql}`, requestBody, options)).data;
  },

  async removeFields(rql, requestBody, options) {
    return (
      await client.post(httpAuth, `/remove_fields${rql}`, requestBody, options)
    ).data;
  },

  async getComorbidities(options) {
    return (await client.get(httpAuth, '/comorbidities', options)).data;
  },

  async getImpediments(options) {
    return (await client.get(httpAuth, '/impediments', options)).data;
  },
});
