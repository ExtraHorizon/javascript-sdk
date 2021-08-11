import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import { DataIndexesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataIndexesService => ({
  async create(schemaId, requestBody, options) {
    return (
      await client.post(httpAuth, `/${schemaId}/indexes`, requestBody, options)
    ).data;
  },

  async remove(indexId, schemaId, options) {
    return (
      await client.delete(httpAuth, `/${schemaId}/indexes/${indexId}`, options)
    ).data;
  },
});
