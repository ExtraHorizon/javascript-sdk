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

  async get(options) {
    return (
      await client.get(
        httpWithAuth,
        `/applications${options?.rql || ''}`,
        options
      )
    ).data;
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
