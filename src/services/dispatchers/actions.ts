import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ActionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ActionsService => ({
  async create(dispatcherId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${dispatcherId}/actions`,
        requestBody,
        options
      )
    ).data;
  },

  async update(dispatcherId, actionId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${dispatcherId}/actions/${actionId}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(dispatcherId, actionId, options) {
    return (
      await client.delete(
        httpAuth,
        `/${dispatcherId}/actions/${actionId}`,
        options
      )
    ).data;
  },
});
