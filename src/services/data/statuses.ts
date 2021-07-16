import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { DataStatusesService, StatusData } from './types';

export default (client, httpAuth: HttpInstance): DataStatusesService => ({
  async create(
    schemaId: ObjectId,
    requestBody: {
      name: string;
      data?: StatusData;
    }
  ): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/statuses`, requestBody))
      .data;
  },

  async update(
    schemaId: ObjectId,
    name: string,
    requestBody: StatusData
  ): Promise<AffectedRecords> {
    return (
      await client.put(httpAuth, `/${schemaId}/statuses/${name}`, requestBody)
    ).data;
  },

  async remove(schemaId: ObjectId, name: string): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}/statuses/${name}`))
      .data;
  },
});
