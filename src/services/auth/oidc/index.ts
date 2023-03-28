import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import { OidcLinkRequestBody, OidcService } from './types';

export default (
  oidcClient: HttpClient,
  httpWithAuth: HttpInstance
): OidcService => ({
  async createProvider(requestBody) {
    const { data } = await oidcClient.post(
      httpWithAuth,
      `/oidc/providers`,
      requestBody
    );
    return data;
  },

  async getProviders(options) {
    const { data } = await oidcClient.get(
      httpWithAuth,
      `/oidc/providers${options?.rql || ''}`,
      options
    );
    return data;
  },

  async updateProvider(providerId, requestBody) {
    const { data } = await oidcClient.put(
      httpWithAuth,
      `/oidc/providers/${providerId}`,
      requestBody
    );
    return data;
  },

  async deleteProvider(providerId) {
    const { data } = await oidcClient.delete(
      httpWithAuth,
      `/oidc/providers/${providerId}`
    );
    return data;
  },

  async enableProvider(providerId: string) {
    const { data } = await oidcClient.post(
      httpWithAuth,
      `/oidc/providers/${providerId}/enable`,
      {}
    );
    return data;
  },

  async disableProvider(providerId: string) {
    const { data } = await oidcClient.post(
      httpWithAuth,
      `/oidc/providers/${providerId}/disable`,
      {}
    );
    return data;
  },

  async linkUserToOidcProvider(
    providerName: string,
    linkRequestBody: OidcLinkRequestBody
  ) {
    const { data } = await oidcClient.post(
      httpWithAuth,
      `/oidc/providers/${providerName}/link`,
      { ...linkRequestBody }
    );
    return data;
  },

  async unlinkUserFromOidc(userId: string) {
    const { data } = await oidcClient.post(
      httpWithAuth,
      `/oidc/users/${userId}/unlink`,
      {}
    );
    return data;
  },
});
