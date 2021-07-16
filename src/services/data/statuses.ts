import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataStatusesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataStatusesService => ({
  async create(schemaId, requestBody, options) {
    return (
      await client.post(httpAuth, `/${schemaId}/statuses`, requestBody, options)
    ).data;
  },

  async update(schemaId, name, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/statuses/${name}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(schemaId, name, options) {
    return (
      await client.delete(httpAuth, `/${schemaId}/statuses/${name}`, options)
    ).data;
  },
});
