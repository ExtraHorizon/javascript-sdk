import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import { ProfilesGroupsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ProfilesGroupsService => ({
  async create(profileId, requestBody, options) {
    return (
      await client.post(httpAuth, `/${profileId}/groups`, requestBody, {
        ...options,
        customKeys: ['custom_fields'],
      })
    ).data;
  },

  async update(profileId, groupId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${profileId}/groups/${groupId}`,
        requestBody,
        { ...options, customKeys: ['custom_fields'] }
      )
    ).data;
  },

  async remove(profileId, groupId, options) {
    return (
      await client.delete(httpAuth, `/${profileId}/groups/${groupId}`, options)
    ).data;
  },

  async removeFields(profileId, groupId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${profileId}/groups/${groupId}/remove_fields`,
        requestBody,
        { ...options, customResponseKeys: ['custom_fields'] }
      )
    ).data;
  },
});
