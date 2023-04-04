import { AffectedRecords } from '../../types';
import { LoginAttemptsService } from './loginAttempts/types';
import { OidcProviderService } from './providers/types';

export interface OidcService {
  /**
   * ##Link the authenticated user to a provider
   * ###You can use this function to link the currently logged-in user to a registered provider.
   *
   * **Default Permissions:**
   * - Any authenticated user can execute this function.
   *
   * @param providerName {@link string} The name of the OpenID Connect provider to link the user to
   * @param data {@link OidcLinkRequestBody} - The link to OpenID Connect provider data
   * @returns An affected records response {@link AffectedRecords}
   * @throws {@link IllegalStateError} when the provider is disabled. The provider must be enabled to link a user.
   * @throws {@link ResourceUnknownError} when no provider is found for the specified providerName.
   */
  linkUserToOidcProvider(
    providerName: string,
    data: OidcLinkRequestBody
  ): Promise<AffectedRecords>;

  /**
   * ##Unlink a user from OpenID Connect
   * ###You can use this function to unlink a user from an OpenId Connect Provider.
   *
   * **Global Permissions:**
   * - `UNLINK_USER_FROM_OIDC` - Allows a user to unlink users from OpenID Connect
   *
   * @param userId {@link string} - The Extra Horizon id of the user to be unlinked from OpenID Connect
   * @returns An affected records response {@link AffectedRecords}
   */
  unlinkUserFromOidc(userId: string): Promise<AffectedRecords>;

  providers: OidcProviderService;
  loginAttempts: LoginAttemptsService;
}

export interface OidcLinkRequestBody {
  /** ###The users Extra Horizon presence token - Obtained from {@link AuthService.confirmPresence confirmPresence} */
  presenceToken: string;
  /** ###Obtained from the OpenID Connect application upon successful user login. */
  authorizationCode: string;
}
