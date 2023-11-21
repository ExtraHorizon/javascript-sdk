import type { HttpInstance } from '../../types';
import { addCustomPropertiesToConfig } from '../helpers';
import { HttpClient } from '../http-client';
import { ProfilesGroupsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ProfilesGroupsService => ({
  async create(profileId, requestBody, options) {
    const customProperties = ['custom_fields'];

    return (
      await client.post(
        httpAuth,
        `/${profileId}/groups`,
        requestBody,
        addCustomPropertiesToConfig(customProperties, httpAuth, options)
      )
    ).data;
  },

  async update(profileId, groupId, requestBody, options) {
    const customProperties = ['custom_fields'];
    return (
      await client.put(
        httpAuth,
        `/${profileId}/groups/${groupId}`,
        requestBody,
        addCustomPropertiesToConfig(customProperties, httpAuth, options)
      )
    ).data;
  },

  async remove(profileId, groupId, options) {
    return (
      await client.delete(httpAuth, `/${profileId}/groups/${groupId}`, options)
    ).data;
  },

  async removeFields(profileId, groupId, requestBody, options) {
    const customProperties = ['custom_fields'];
    return (
      await client.post(
        httpAuth,
        `/${profileId}/groups/${groupId}/remove_fields`,
        requestBody,
        addCustomPropertiesToConfig(customProperties, httpAuth, options)
      )
    ).data;
  },
});
