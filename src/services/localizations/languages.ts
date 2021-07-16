import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { LanguagesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): LanguagesService => ({
  async getLanguages(options) {
    return (await client.get(httpAuth, '/languages', options)).data.data;
  },
});
