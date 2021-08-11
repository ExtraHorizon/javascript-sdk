import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataPropertiesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataPropertiesService => ({
  async create(schemaId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/properties`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(schemaId, propertyPath, options) {
    return (
      await client.delete(
        httpAuth,
        `/${schemaId}/properties/${propertyPath}`,
        options
      )
    ).data;
  },

  async update(schemaId, propertyPath, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/properties/${propertyPath}`,
        requestBody,
        options
      )
    ).data;
  },
});
