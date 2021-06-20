import type { HttpInstance } from '../../types';
import { PagedResult } from '../types';
import { SupportedLanguageCodes } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Retrieve a list of all the defined languages
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns any Success
   * @throws ApiError
   */
  async getLanguages(): Promise<PagedResult<SupportedLanguageCodes>> {
    return (await client.get(httpAuth, '/languages')).data;
  },
});
