import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { DataTransitionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataTransitionsService => ({
  async updateCreation(schemaIdOrName, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaIdOrName}/creationTransition`,
        requestBody,
        options
      )
    ).data;
  },

  async create(schemaIdOrName, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${schemaIdOrName}/transitions`,
        requestBody,
        options
      )
    ).data;
  },

  async update(schemaIdOrName, transitionId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaIdOrName}/transitions/${transitionId}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(schemaIdOrName, transitionId, options) {
    return (
      await client.delete(
        httpAuth,
        `/${schemaIdOrName}/transitions/${transitionId}`,
        options
      )
    ).data;
  },
});
