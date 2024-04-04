import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataStatusesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataStatusesService => ({
  async create(schemaIdOrName, requestBody, options) {
    return (
      await client.post(httpAuth, `/${schemaIdOrName}/statuses`, requestBody, options)
    ).data;
  },

  async update(schemaIdOrName, name, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaIdOrName}/statuses/${name}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(schemaIdOrName, name, options) {
    return (
      await client.delete(httpAuth, `/${schemaIdOrName}/statuses/${name}`, options)
    ).data;
  },
});
