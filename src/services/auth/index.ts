import type { HttpInstance } from '../../types';
import type { Presence } from './types';
import httpClient from '../http-client';
import { OptionsBase, Results } from '../types';
import applications from './applications';
import oauth2 from './oauth2';
import oauth1 from './oauth1';
import users from './users';
import oidc from './oidc';
import { AUTH_BASE } from '../../constants';

export const authService = (httpWithAuth: HttpInstance) => {
  const authClient = httpClient({
    basePath: AUTH_BASE,
  });

  return {
    applications: applications(authClient, httpWithAuth),
    oauth2: oauth2(authClient, httpWithAuth),
    oauth1: oauth1(authClient, httpWithAuth),
    users: users(authClient, httpWithAuth),
    oidc: oidc(authClient, httpWithAuth),

    /**
     * Generate a presence token by supplying a secret to confirm the presence of the owner of the account
     *
     * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Confirm%20presence/post_confirmPresence
     * @throws {UserNotAuthenticatedError}
     * @throws {AuthenticationError}
     * @throws {LoginTimeoutError}
     * @throws {LoginFreezeError}
     * @throws {TooManyFailedAttemptsError}
     * */
    async confirmPresence(
      data: { password: string },
      options?: OptionsBase
    ): Promise<Presence> {
      return (
        await authClient.post(httpWithAuth, `/confirmPresence`, data, options)
      ).data;
    },

    /**
     * Check the service health
     *
     * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/Service%20health/get_health
     * */
    async health(): Promise<boolean> {
      return (
        (await authClient.get(httpWithAuth, '/health')).status ===
        Results.Success
      );
    },
  };
};
