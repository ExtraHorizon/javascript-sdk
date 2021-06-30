import type { HttpInstance } from '../../types';
import type { CountriesService } from './types';

export default (client, httpAuth: HttpInstance): CountriesService => ({
  /**
   * Retrieve a list of all the defined countries
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @returns PagedResult<string>
   */
  async getCountries(): Promise<string[]> {
    return (await client.get(httpAuth, '/countries')).data.data;
  },

  /**
   * Retrieve a list of all the defined regions for the specified country code
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param country The country code (as defined in ISO 3166-1)
   * @returns PagedResult<string>
   * @throws {ResourceUnknownError}
   */
  async getRegions(country: string): Promise<string[]> {
    return (await client.get(httpAuth, `/countries/${country}/regions`)).data
      .data;
  },
});
