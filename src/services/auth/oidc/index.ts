import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import loginAttempts from './loginAttempts';
import providers from './providers';
import { OidcLinkRequestBody, OidcService } from './types';

export default (
  oidcClient: HttpClient,
  httpWithAuth: HttpInstance
): OidcService => ({
  async linkUserToOidcProvider(
    providerName: string,
    body: OidcLinkRequestBody
  ) {
    const { data } = await oidcClient.post(
      httpWithAuth,
      `/oidc/providers/${providerName}/link`,
      body
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

  providers: providers(oidcClient, httpWithAuth),
  loginAttempts: loginAttempts(oidcClient, httpWithAuth),
});
