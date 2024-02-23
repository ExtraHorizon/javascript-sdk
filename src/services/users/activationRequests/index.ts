import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import { ActivationRequestsService } from './types';

export const activationRequestsService = (
  client: HttpClient,
  httpWithAuth: HttpInstance
): ActivationRequestsService => ({

  async find(options) {
    const response = await client.get(httpWithAuth, `/activation_requests/${options?.rql || ''}`, options);
    return response.data;
  },

  async remove(id, options) {
    const response = await client.delete(httpWithAuth, `/activation_requests/${id}`, options);
    return response.data;
  },

});
