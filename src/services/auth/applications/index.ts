import { rqlBuilder } from '../../../rql';
import type { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import type { AuthApplicationsService } from '../types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthApplicationsService => ({
  async create(data, options) {
    return (await client.post(httpWithAuth, '/applications', data, options))
      .data;
  },

  async find(options) {
    return (
      await client.get(
        httpWithAuth,
        `/applications${options?.rql || ''}`,
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

  async findByName(name, options?) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    return await this.findFirst({ ...options, rql: rqlWithName });
  },

  async get(options) {
    return this.find(options);
  },

  async update(applicationId, data, options) {
    return (
      await client.put(
        httpWithAuth,
        `/applications/${applicationId}`,
        data,
        options
      )
    ).data;
  },

  async remove(applicationId, options) {
    return (
      await client.delete(
        httpWithAuth,
        `/applications/${applicationId}`,
        options
      )
    ).data;
  },

  async createVersion(applicationId, data, options) {
    return (
      await client.post(
        httpWithAuth,
        `/applications/${applicationId}/versions`,
        data,
        options
      )
    ).data;
  },

  async deleteVersion(applicationId, versionId, options) {
    return (
      await client.delete(
        httpWithAuth,
        `/applications/${applicationId}/versions/${versionId}`,
        options
      )
    ).data;
  },
});
