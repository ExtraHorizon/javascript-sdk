import { RQLString } from '../../rql';
import type { HttpInstance } from '../../types';
import type {
  Application,
  ApplicationCreation,
  ApplicationList,
  ApplicationUpdate,
  ApplicationVersionCreation,
  ApplicationVersion,
  OAuth2Authorization,
  OAuth2AuthorizationCreation,
  OAuth2AuthorizationList,
  MfaSetting,
  Presence,
  MfaMethodCreation,
  MfaMethodVerification,
  PresenceToken,
  MfaMethod,
} from './types';
import httpClient from '../http-client';
import type { AffectedRecords } from '../models/Responses';
import { AUTH_BASE } from '../../constants';
import { Results } from '../models/Results';

export default (http: HttpInstance, httpWithAuth: HttpInstance) => {
  const authClient = httpClient({
    basePath: AUTH_BASE,
  });

  return {
    /**
     * Create an OAuth application
     *
     * @permission CREATE_APPLICATIONS | scope:global |
     * @async
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications
     */
    async createApplication(data: ApplicationCreation): Promise<Application> {
      return (await authClient.post(httpWithAuth, '/applications', data)).data;
    },

    /**
     * Get a list of applications
     * @permission VIEW_APPLICATIONS | scope:global |
     * @async
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/get_applications
     * */
    async getApplications(rql?: RQLString): Promise<ApplicationList> {
      return (await authClient.get(httpWithAuth, `/applications${rql || ''}`))
        .data;
    },

    /**
     * Update an OAuth application
     *
     * @permission UPDATE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/put_applications
     * @throws {ResourceUnknownError}
     */
    async updateApplication(
      applicationId: string,
      data: ApplicationUpdate
    ): Promise<Application> {
      return (
        await authClient.put(
          httpWithAuth,
          `/applications/${applicationId}`,
          data
        )
      ).data;
    },

    /**
     * Delete an OAuth application
     *
     * @permission DELETE_APPLICATIONS | scope:global |
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId_
     * @throws {ResourceUnknownError}
     */
    async deleteApplication(applicationId: string): Promise<AffectedRecords> {
      return (
        await authClient.delete(httpWithAuth, `/applications/${applicationId}`)
      ).data;
    },

    /**
     * Create an application version
     *
     * @permission CREATE_APPLICATIONS | scope:global | Required for this endpoint
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/post_applications__applicationId__versions
     */
    async createApplicationVersion(
      applicationId: string,
      data: ApplicationVersionCreation
    ): Promise<ApplicationVersion> {
      return (
        await authClient.post(
          httpWithAuth,
          `/applications/${applicationId}/versions`,
          data
        )
      ).data;
    },

    /**
     * Delete an application version
     *
     * @permission DELETE_APPLICATIONS | scope:global | Required for this endpoint
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Applications/delete_applications__applicationId__versions__versionId_
     * @throws {ResourceUnknownError}
     */
    async deleteApplicationVersion(
      applicationId: string,
      versionId: string
    ): Promise<AffectedRecords> {
      return (
        await authClient.delete(
          httpWithAuth,
          `/applications/${applicationId}/${versionId}`
        )
      ).data;
    },

    /**
     * Create an OAuth2 authorization
     *
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/post_oauth2_authorizations
     * @throws {ApplicationUnknownError}
     * @throws {CallbackNotValidError}
     * @throws {UnsupportedResponseTypeError}
     */
    async createOauth2Authorization(
      data: OAuth2AuthorizationCreation
    ): Promise<OAuth2Authorization> {
      return (
        await authClient.post(httpWithAuth, `/oauth2/authorizations`, data)
      ).data;
    },

    /**
     * Get a list of OAuth2 Authorizations
     *
     * @permission VIEW_AUTHORIZATIONS | scope:global | Required for this endpoint
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/get_oauth2_authorizations
     */
    async getOauth2Authorizations(
      rql?: RQLString
    ): Promise<OAuth2AuthorizationList> {
      return (
        await authClient.get(httpWithAuth, `/oauth2/authorizations${rql || ''}`)
      ).data;
    },

    /**
     * Delete an OAuth2 Authorization
     *
     * @permission DELETE_AUTHORIZATIONS | scope:global |	Required for this endpoint
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/OAuth2/delete_oauth2_authorizations__authorizationId_
     * @throws {ResourceUnknownError}
     */
    async deleteOauth2Authorization(
      authorizationId: string
    ): Promise<AffectedRecords> {
      return (
        await authClient.delete(
          httpWithAuth,
          `/oauth2/authorizations/${authorizationId}`
        )
      ).data;
    },

    /**
     * Generate a presence token by supplying a secret to confirm the presence of the owner of the account
     *
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Confirm%20presence/post_confirmPresence
     * @throws {UserNotAuthenticatedError}
     * @throws {AuthenticationError}
     * @throws {LoginTimeoutError}
     * @throws {LoginFreezeError}
     * @throws {TooManyFailedAttemptsError}
     * */
    async confirmPresence(data: { password: string }): Promise<Presence> {
      return (await authClient.post(httpWithAuth, `/confirmPresence`, data))
        .data;
    },

    /**
     * View the MFA settings of a user (or create the settings if they have none)
     *
     * @permission VIEW_USER_MFA_SETTINGS | scope:global | See anyone their MFA settings
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/get_mfa_users__userId_
     */
    async mfaSetting(userId: string): Promise<MfaSetting> {
      return (await authClient.get(httpWithAuth, `/mfa/users/${userId}`)).data;
    },

    /**
     * Enable MFA for a user
     *
     * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__enable
     * @throws {InvalidPresenceTokenError}
     * @throws {NotEnoughMfaMethodsError}
     */
    async mfaEnable(
      userId: string,
      data: PresenceToken
    ): Promise<AffectedRecords> {
      return (
        await authClient.post(httpWithAuth, `/mfa/users/${userId}/enable`, data)
      ).data;
    },

    /**
     * Disable MFA for a user
     *
     * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
     * @throws {InvalidPresenceTokenError}
     */
    async mfaDisable(
      userId: string,
      data: PresenceToken
    ): Promise<AffectedRecords> {
      return (
        await authClient.post(
          httpWithAuth,
          `/mfa/users/${userId}/disable`,
          data
        )
      ).data;
    },

    /**
     * Add a MFA method to a user
     *
     * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
     * @throws {InvalidPresenceTokenError}
     */
    async mfaAddMethod(
      userId: string,
      data: MfaMethodCreation
    ): Promise<MfaMethod> {
      return (
        await authClient.post(
          httpWithAuth,
          `/mfa/users/${userId}/methods`,
          data
        )
      ).data;
    },

    /**
     * Confirm the correct functioning of a MFA method
     *
     * @permission UPDATE_USER_MFA_SETTINGS | scope:global | 	Enable MFA for any account
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__methods__methodId__verification_confirm
     * @throws {ResourceUnknownError}
     * @throws {IllegalArgumentException}
     * @throws {InvalidMfaCodeError}
     * @throws {InvalidPresenceTokenError}
     */
    async mfaMethodConfirmVerification(
      userId: string,
      methodId: string,
      data: MfaMethodVerification
    ): Promise<{ description: string }> {
      return (
        await authClient.post(
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
    async mfaMethodRemove(
      userId: string,
      methodId: string,
      data: PresenceToken
    ): Promise<AffectedRecords> {
      return (
        await authClient.post(
          httpWithAuth,
          `/mfa/users/${userId}/methods/${methodId}/remove`,
          data
        )
      ).data;
    },

    /**
     * Check the service health
     *
     * @see https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/openapi.yaml#/Service%20health/get_health
     * */
    async health(): Promise<boolean> {
      return (await authClient.get(http, '/health')).status === Results.Success;
    },
  };
};
