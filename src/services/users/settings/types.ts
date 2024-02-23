import { OptionsBase } from '../../types';

export interface UsersSettingsService {
  /**
   * Retrieve the verification settings
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_USER_VERIFICATION_SETTINGS` | global | **Required** for this endpoint
   */
  getVerificationSettings(options?: OptionsBase): Promise<VerificationSettings>;

  /**
   * Update the verification settings
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_USER_VERIFICATION_SETTINGS` | global | **Required** for this endpoint
   */
  updateVerificationSettings(
    data: Partial<VerificationSettings>,
    options?: OptionsBase
  ): Promise<VerificationSettings>;
}

export interface VerificationSettings {
  limitActivationRequests: boolean;
  limitForgotPasswordRequests: boolean;
  enablePinCodeActivationRequests: boolean;
  enablePinCodeForgotPasswordRequests: boolean;
}
