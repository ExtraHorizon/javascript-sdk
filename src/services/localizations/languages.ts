import type { HttpInstance } from '../../types';
import type { LanguagesService } from './types';

export default (client, httpAuth: HttpInstance): LanguagesService => ({
  async getLanguages(): Promise<string[]> {
    return (await client.get(httpAuth, '/languages')).data.data;
  },
});
