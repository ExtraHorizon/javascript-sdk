import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { CountriesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): CountriesService => ({
  async getCountries(options) {
    return (await client.get(httpAuth, '/countries', options)).data.data;
  },

  async getRegions(country, options) {
    return (
      await client.get(httpAuth, `/countries/${country}/regions`, options)
    ).data.data;
  },
});
