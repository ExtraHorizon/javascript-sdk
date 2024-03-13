import { OptionsBase } from '../../types';

export interface SettingsService {
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

  /**
   * Allow use of the pin code mode for the account activation flow.
   */
  enablePinCodeActivationRequests: boolean;

  /**
   * Allow use of the pin code mode for the forgot password flow.
   */
  enablePinCodeForgotPasswordRequests: boolean;

  /**
   * Turns on the following limits for the account activation flow in hash mode:
   * - Limits the time a hash is valid to 60 minutes.
   * - Limits the amount of times the flow can be initiated without success to 5.
   * - Requires the time between initiations to be at least 5 minutes.
   *
   * @deprecated Security feature. Only should be disabled while existing applications implement the feature, otherwise this feature should always be enabled.
   */
  limitHashActivationRequests: boolean;

  /**
   * Turns on the following limits for the forgot password flow in hash mode:
   * - Limits the time a hash is valid to 60 minutes.
   * - Limits the amount of times the flow can be initiated without success to 5.
   * - Requires the time between initiations to be at least 5 minutes.
   *
   * @deprecated Security feature. Only should be disabled while existing applications implement the feature, otherwise this feature should always be enabled.
   */
  limitHashForgotPasswordRequests: boolean;
}
