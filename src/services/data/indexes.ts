import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import { DataIndexesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataIndexesService => ({
  async create(schemaIdOrName, requestBody, options) {
    return (
      await client.post(httpAuth, `/${schemaIdOrName}/indexes`, requestBody, options)
    ).data;
  },

  async remove(indexId, schemaIdOrName, options) {
    return (
      await client.delete(httpAuth, `/${schemaIdOrName}/indexes/${indexId}`, options)
    ).data;
  },
});
