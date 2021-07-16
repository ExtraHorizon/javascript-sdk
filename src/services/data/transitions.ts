import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataTransitionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataTransitionsService => ({
  async updateCreation(schemaId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/creationTransition`,
        requestBody,
        options
      )
    ).data;
  },

  async create(schemaId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/transitions`,
        requestBody,
        options
      )
    ).data;
  },

  async update(schemaId, transitionId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/transitions/${transitionId}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(schemaId, transitionId, options) {
    return (
      await client.delete(
        httpAuth,
        `/${schemaId}/transitions/${transitionId}`,
        options
      )
    ).data;
  },
});
