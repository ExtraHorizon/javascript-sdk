import { OptionsBase } from '../types';
import { AuthApplicationsService } from './applications/types';
import { AuthOauth1Service } from './oauth1/types';
import { AuthOauth2Service } from './oauth2/types';
import { OidcService } from './oidc/types';
import { AuthUsersService } from './users/types';

export * from './applications/types';
export * from './oauth1/types';
export * from './oauth2/types';
export * from './oidc/types';
export * from './users/types';

export interface AuthService {
  /**
   * # Applications
   * Applications represent mobile apps, web apps, web services or scripts that can communicate with the Extra Horizon API.
   *
   * ### Default applications
   * When launching a new cluster two default applications are already created for you:
   *
   * **ExH Control center**: An oAuth2 app that gives our control center (available on  [app.extrahorizon.com](app.extrahorizon.com)) the ability to communicate with your cluster. You as an admin can use this app to explore and manage your cluster.
   *
   * **CLI**: An oAuth1.0 application that you can use when installing our CLI in order to send configurations to your cluster. Credentials are provided to your cluster manager during onboarding.
   */
  applications: AuthApplicationsService;
  oauth2: AuthOauth2Service;
  oauth1: AuthOauth1Service;
  users: AuthUsersService;
  oidc: OidcService;
  confirmPresence(
    data: { password: string; },
    options?: OptionsBase
  ): Promise<Presence>;
  health(): Promise<boolean>;
}

export { AuthApplicationsService };

export interface Presence {
  token: string;
  updateTimestamp: Date;
  creationTimestamp: Date;
}
