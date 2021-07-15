import type { HttpInstance } from '../../types';
import type { LanguagesService } from './types';

export default (client, httpAuth: HttpInstance): LanguagesService => ({
  /**
   * Retrieve a list of all the defined languages
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns <SupportedLanguageCodesValues[]>
   */
  async getLanguages(): Promise<string[]> {
    return (await client.get(httpAuth, '/languages')).data.data;
  },
});
