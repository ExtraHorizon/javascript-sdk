import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords } from '../types';
import type { DataPropertiesService, TypeConfiguration } from './types';

export default (client, httpAuth: HttpInstance): DataPropertiesService => ({
  async create(
    schemaId: ObjectId,
    requestBody: {
      name: string;
      configuration: TypeConfiguration;
    }
  ): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/properties`, requestBody))
      .data;
  },

  async remove(
    schemaId: ObjectId,
    propertyPath: string
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/properties/${propertyPath}`)
    ).data;
  },

  async update(
    schemaId: ObjectId,
    propertyPath: string,
    requestBody: TypeConfiguration
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/properties/${propertyPath}`,
        requestBody
      )
    ).data;
  },
});
