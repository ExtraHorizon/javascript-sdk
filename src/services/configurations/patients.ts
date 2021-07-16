import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ConfigurationsPatientsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ConfigurationsPatientsService => ({
  async update(groupId, userId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/users/${userId}/patientConfigurations/${groupId}`,
        requestBody,
        options
      )
    ).data;
  },

  async removeFields(groupId, userId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/users/${userId}/patientConfigurations/${groupId}/deleteFields`,
        requestBody,
        options
      )
    ).data;
  },
});
