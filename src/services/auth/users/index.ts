import type { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import type { AuthUsersService } from './types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): AuthUsersService => ({
  async getMfaSetting(userId, options) {
    return (await client.get(httpWithAuth, `/mfa/users/${userId}`, options))
      .data;
  },

  async enableMfa(userId, data, options) {
    return (
      await client.post(
        httpWithAuth,
        `/mfa/users/${userId}/enable`,
        data,
        options
      )
    ).data;
  },

  async disableMfa(userId, data, options) {
    return (
      await client.post(
        httpWithAuth,
        `/mfa/users/${userId}/disable`,
        data,
        options
      )
    ).data;
  },

  async addMfaMethod(userId, data, options) {
    return (
      await client.post(
        httpWithAuth,
        `/mfa/users/${userId}/methods`,
        data,
        options
      )
    ).data;
  },

  async confirmMfaMethodVerification(userId, methodId, data, options) {
    return (
      await client.post(
        httpWithAuth,
        `/mfa/users/${userId}/methods/${methodId}/verification/confirm`,
        data,
        options
      )
    ).data;
  },

  async removeMfaMethod(userId, methodId, data, options) {
    return (
      await client.post(
        httpWithAuth,
        `/mfa/users/${userId}/methods/${methodId}/remove`,
        data,
        options
      )
    ).data;
  },
});
