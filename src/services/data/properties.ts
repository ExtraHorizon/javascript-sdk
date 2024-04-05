import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataPropertiesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataPropertiesService => ({
  async create(schemaIdOrName, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${schemaIdOrName}/properties`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(schemaIdOrName, propertyPath, options) {
    return (
      await client.delete(
        httpAuth,
        `/${schemaIdOrName}/properties/${propertyPath}`,
        options
      )
    ).data;
  },

  async update(schemaIdOrName, propertyPath, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaIdOrName}/properties/${propertyPath}`,
        requestBody,
        options
      )
    ).data;
  },
});
