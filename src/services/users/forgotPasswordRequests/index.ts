import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import { ForgotPasswordRequestsService } from './types';

export const forgotPasswordRequestsService = (
  client: HttpClient,
  httpWithAuth: HttpInstance
): ForgotPasswordRequestsService => ({

  async find(options) {
    const response = await client.get(httpWithAuth, `/forgot_password_requests/${options?.rql || ''}`, options);
    return response.data;
  },

  async remove(id, options) {
    const response = await client.delete(httpWithAuth, `/forgot_password_requests/${id}`, options);
    return response.data;
  },

});
