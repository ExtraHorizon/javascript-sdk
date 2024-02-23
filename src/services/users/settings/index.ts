import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import { UsersSettingsService } from './types';

export const userSettingsService = (
  client: HttpClient,
  httpWithAuth: HttpInstance
): UsersSettingsService => ({

  async getVerificationSettings(options) {
    const response = await client.get(httpWithAuth, '/settings/verification', options);
    return response.data;
  },

  async updateVerificationSettings(data, options) {
    const response = await client.put(httpWithAuth, '/settings/verification', data, options);
    return response.data;
  },

});
