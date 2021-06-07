import type { HttpInstance } from '../../types';
import { AffectedRecords } from '../types';
import type {
  MfaMethod,
  MfaMethodCreation,
  MfaMethodVerification,
  MfaSetting,
  PresenceToken,
} from './types';

export default (client, httpWithAuth: HttpInstance) => ({
  /**
   * View the MFA settings of a user (or create the settings if they have none)
   *
   * @permission VIEW_USER_MFA_SETTINGS | scope:global | See anyone their MFA settings
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/get_mfa_users__userId_
   */
  async getMfaSetting(userId: string): Promise<MfaSetting> {
    return (await client.get(httpWithAuth, `/mfa/users/${userId}`)).data;
  },

  /**
   * Enable MFA for a user
   *
   * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__enable
   * @throws {InvalidPresenceTokenError}
   * @throws {NotEnoughMfaMethodsError}
   */
  async enableMfa(
    userId: string,
    data: PresenceToken
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpWithAuth, `/mfa/users/${userId}/enable`, data)
    ).data;
  },

  /**
   * Disable MFA for a user
   *
   * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
   * @throws {InvalidPresenceTokenError}
   */
  async disableMfa(
    userId: string,
    data: PresenceToken
  ): Promise<AffectedRecords> {
    return (
      await client.post(httpWithAuth, `/mfa/users/${userId}/disable`, data)
    ).data;
  },

  /**
   * Add a MFA method to a user
   *
   * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
   * @throws {InvalidPresenceTokenError}
   */
  async addMfaMethod(
    userId: string,
    data: MfaMethodCreation
  ): Promise<MfaMethod> {
    return (
      await client.post(httpWithAuth, `/mfa/users/${userId}/methods`, data)
    ).data;
  },

  /**
   * Confirm the correct functioning of a MFA method
   *
   * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__methods__methodId__verification_confirm
   * @throws {ResourceUnknownError}
   * @throws {IllegalArgumentError}
   * @throws {InvalidMfaCodeError}
   * @throws {InvalidPresenceTokenError}
   */
  async confirmMfaMethodVerification(
    userId: string,
    methodId: string,
    data: MfaMethodVerification
  ): Promise<{ description: string }> {
    return (
      await client.post(
        httpWithAuth,
        `/mfa/users/${userId}/methods/${methodId}/verification/confirm`,
        data
      )
    ).data;
  },

  /**
   * Remove a MFA method from a user
   *
   * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
   * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__methods__methodId__remove
   * @throws {NotEnoughMfaMethodsError}
   * @throws {InvalidPresenceTokenError}
   */
  async removeMfaMethod(
    userId: string,
    methodId: string,
    data: PresenceToken
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpWithAuth,
        `/mfa/users/${userId}/methods/${methodId}/remove`,
        data
      )
    ).data;
  },
});
