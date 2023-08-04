import { HttpClient } from '../../http-client';
import { HttpInstance } from '../../../http/types';
import { FileSettingsService, FileServiceSettingsUpdate } from './types';
import { OptionsBase } from '../../types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): FileSettingsService => ({
  async get(options: OptionsBase) {
    const { data } = await client.get(httpAuth, `/settings`, options);
    return data;
  },

  async update(data: FileServiceSettingsUpdate, options: OptionsBase) {
    const response = await client.put(httpAuth, `/settings`, data, options);
    return response.data;
  },
});
