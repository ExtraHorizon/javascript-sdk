import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import { DataIndexesService, Index, IndexInput } from './types';

export default (client, httpAuth: HttpInstance): DataIndexesService => ({
  async create(schemaId: ObjectId, requestBody: IndexInput): Promise<Index> {
    return (await client.post(httpAuth, `/${schemaId}/indexes`, requestBody))
      .data;
  },

  async remove(
    indexId: ObjectId,
    schemaId: ObjectId
  ): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}/indexes/${indexId}`))
      .data;
  },
});
