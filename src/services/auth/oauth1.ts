import type { HttpInstance } from '../../types';
import type { AuthOauth1Service } from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthOauth1Service => ({
  async generateSsoToken() {
    return (await client.post(httpWithAuth, `/oauth1/ssoTokens/generate`, {}))
      .data;
  },

  async consumeSsoToken(ssoToken) {
    return (
      await client.post(httpWithAuth, `/oauth1/ssoTokens/consume`, { ssoToken })
    ).data;
  },
});
