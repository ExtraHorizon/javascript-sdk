import type { HttpInstance } from '../../types';
import type { CountriesService } from './types';

export default (client, httpAuth: HttpInstance): CountriesService => ({
  async getCountries(): Promise<string[]> {
    return (await client.get(httpAuth, '/countries')).data.data;
  },

  async getRegions(country: string): Promise<string[]> {
    return (await client.get(httpAuth, `/countries/${country}/regions`)).data
      .data;
  },
});
