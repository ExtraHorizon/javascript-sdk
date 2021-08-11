import type { HttpInstance } from '../../types';
import type { ConfigurationsGeneralService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsGeneralService => ({
  async get(options) {
    return (await client.get(httpAuth, '/general', options)).data;
  },

  async update(requestBody, options) {
    return (
      await client.put(httpAuth, `/general${options?.rql || ''}`, requestBody)
    ).data;
  },

  async removeFields(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/general/deleteFields${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },
});
