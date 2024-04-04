import { AffectedRecords, OptionsBase } from '../../types';

export interface AuthUsersService {
  /**
   * View the MFA settings of a user (or create the settings if they have none)
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See your own MFA settings
   * VIEW_USER_MFA_SETTINGS | global | See anyone their MFA settings
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/get_mfa_users__userId_
   */
  getMfaSetting(userId: string, options?: OptionsBase): Promise<MfaSetting>;
  /**
   * Enable MFA for a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Enable MFA for your own account
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__enable
   * @throws {InvalidPresenceTokenError}
   * @throws {NotEnoughMfaMethodsError}
   */
  enableMfa(
    userId: string,
    data: PresenceToken,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * Disable MFA for a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Disable MFA for your own account
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
   * @throws {InvalidPresenceTokenError}
   */
  disableMfa(
    userId: string,
    data: PresenceToken,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * Add a MFA method to a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Add a MFA method to your user
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__disable
   * @throws {InvalidPresenceTokenError}
   */
  addMfaMethod<T extends RecoveryCodesMethodCreation | TotpMethodCreation>(
    userId: string,
    data: T,
    options?: OptionsBase
  ): Promise<T extends RecoveryCodesMethodCreation ? RecoveryCodesMethod : TotpMethod>;
  /**
   * Confirm the correct functioning of a MFA method
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Confirm a MFA method for your user
   * UPDATE_USER_MFA_SETTINGS | global | Confirm a MFA method for any user
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__methods__methodId__verification_confirm
   * @throws {ResourceUnknownError}
   * @throws {IllegalArgumentError}
   * @throws {InvalidMfaCodeError}
   * @throws {InvalidPresenceTokenError}
   */
  confirmMfaMethodVerification(
    userId: string,
    methodId: string,
    data: MfaMethodVerification,
    options?: OptionsBase
  ): Promise<{ description: string; }>;
  /**
   * Remove a MFA method from a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Remove a MFA method for your user
   * UPDATE_USER_MFA_SETTINGS | global | Enable MFA for any account
   * @see https://swagger.extrahorizon.com/swagger-ui/?url=https://swagger.extrahorizon.com/auth-service/2.0.4-dev/openapi.yaml#/MFA/post_mfa_users__userId__methods__methodId__remove
   * @throws {NotEnoughMfaMethodsError}
   * @throws {InvalidPresenceTokenError}
   */
  removeMfaMethod(
    userId: string,
    methodId: string,
    data: PresenceToken,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface RecoveryCodesMethod {
  id: string;
  name: string;
  tags: string[];
  verified: boolean;
  type: 'recoveryCodes';
  codes: string[];
  updateTimestamp: Date;
  creationTimestamp: Date;
}

export interface TotpMethod {
  id: string;
  name: string;
  tags: string[];
  verified: boolean;
  type: 'totp';
  secret: string;
  updateTimestamp: Date;
  creationTimestamp: Date;
}

export type MfaMethod = RecoveryCodesMethod | TotpMethod;

export interface MfaSetting {
  id: string;
  methods: [MfaMethod];
  enabled: boolean;
  updateTimestamp: Date;
}

interface MfaMethodCreationBase {
  presenceToken: string;
  name?: string;
  tags?: string[];
}

export interface RecoveryCodesMethodCreation extends MfaMethodCreationBase {
  type: 'recoveryCodes';
}

export interface TotpMethodCreation extends MfaMethodCreationBase {
  type: 'totp';
}

export interface MfaMethodVerification {
  presenceToken: string;
  code: string;
}

export interface PresenceToken {
  presenceToken: string;
}
