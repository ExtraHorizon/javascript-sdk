import type { HttpInstance } from '../../types';
import type { ConfigurationsGroupsService } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsGroupsService => ({
  async get(groupId, options) {
    const { data } = await client.get(httpAuth, `/groups/${groupId}`, {
      ...options,
      customResponseKeys: [
        'data.*',
        'staffConfiguration.*',
        'patientConfiguration.*',
      ],
    });

    return data;
  },

  async update(groupId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/groups/${groupId}${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  async removeFields(groupId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/groups/${groupId}/deleteFields${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },
});
