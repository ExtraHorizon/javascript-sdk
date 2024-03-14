import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ConfigurationsGeneralService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsGeneralService => ({
  async get(options) {
    const { data } = await client.get(httpAuth, '/general', {
      ...options,
      customResponseKeys: [
        'data',
        'userConfiguration',
        'groupConfiguration',
        'staffConfiguration',
        'patientConfiguration',
      ],
    });

    return data;
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
