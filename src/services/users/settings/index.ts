import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import { SettingsService } from './types';

export const settingsService = (
  client: HttpClient,
  httpWithAuth: HttpInstance
): SettingsService => ({

  async getVerificationSettings(options) {
    const response = await client.get(httpWithAuth, '/settings/verification', options);
    return response.data;
  },

  async updateVerificationSettings(data, options) {
    const response = await client.put(httpWithAuth, '/settings/verification', data, options);
    return response.data;
  },

});
