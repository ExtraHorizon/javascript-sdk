import type { HttpInstance } from '../../types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Retrieve a list of all the defined languages
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns PagedResult<SupportedLanguageCodes>
   */
  async getLanguages(): Promise<string[]> {
    return (await client.get(httpAuth, '/languages')).data.data;
  },
});
