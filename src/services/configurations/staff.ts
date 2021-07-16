import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ConfigurationsStaffService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsStaffService => ({
  async update(groupId, userId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}/staffConfigurations/${groupId}`,
        requestBody,
        options
      )
    ).data;
  },

  async removeFields(groupId, userId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/users/${userId}/staffConfigurations/${groupId}/deleteFields`,
        requestBody,
        options
      )
    ).data;
  },
});
