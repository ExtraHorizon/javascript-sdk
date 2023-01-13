import { HttpInstance, OidcService } from '../../types';
import { HttpClient } from '../http-Client';

export default (
  oidcClient: HttpClient,
  httpWithAuth: HttpInstance
): OidcService => ({
  async createProvider(requestBody) {
    return (await oidcClient.post(httpWithAuth, `/oidc/providers`, requestBody))
      .data;
  },

  async getProviders(options) {
    return await (
      await oidcClient.get(httpWithAuth, `/oidc/providers`, options)
    ).data;
  },

  async updateProvider(providerId, requestBody) {
    return await (
      await oidcClient.put(
        httpWithAuth,
        `/oidc/providers/${providerId}`,
        requestBody
      )
    ).data;
  },

  async deleteProvider(providerId) {
    return await (
      await oidcClient.delete(httpWithAuth, `/oidc/providers/${providerId}`)
    ).data;
  },
});
