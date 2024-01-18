import { HttpClient } from '../../http-client';
import { HttpInstance } from '../../../http/types';
import { ActionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ActionsService => ({
  async create(dispatcherId, requestBody, options) {
    const { data } = await client.post(
      httpAuth,
      `/${dispatcherId}/actions`,
      requestBody,
      { ...options, customResponseKeys: ['data'] }
    );

    return data;
  },

  async update(dispatcherId, actionId, requestBody, options) {
    const { data } = await client.put(
      httpAuth,
      `/${dispatcherId}/actions/${actionId}`,
      requestBody,
      options
    );

    return data;
  },

  async remove(dispatcherId, actionId, options) {
    const { data } = await client.delete(
      httpAuth,
      `/${dispatcherId}/actions/${actionId}`,
      options
    );

    return data;
  },
});
