import { AffectedRecords, OptionsBase, OptionsWithRql, PagedResult } from '../../types';

export interface ForgotPasswordRequestsService {
  /**
   * Retrieve a list of forgot password requests
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_FORGOT_PASSWORD_REQUESTS` | global | **Required** for this endpoint
   */
  find(options?: OptionsWithRql): Promise<PagedResult<ForgotPasswordRequest>>;

  /**
   * Remove a forgot password request
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_FORGOT_PASSWORD_REQUEST` | global | **Required** for this endpoint
   */
  remove(id: string, options?: OptionsBase): Promise<AffectedRecords>;
}

export interface ForgotPasswordRequest {
  id: string;
  userId: string;
  mode?: 'hash' | 'pin_code';

  /**
   * The amount of times the account forgot password flow was initiated without completion.
   */
  requestCount?: number;

  /**
   * The last time the account forgot password flow was initiated.
   */
  lastRequestTimestamp?: number;

  /**
   * (Pin code mode only) the amount of attempts with an incorrect pin code for the current forgot password request.
   */
  failedAttempts?: number;

  /**
   * (Pin code mode only) the last time an incorrect pin code for the current forgot password request.
   */
  lastFailedAttemptTimestamp?: Date;

  /**
   * The time until which the forgot password request can be used.
   */
  expiryTimestamp?: Date;

  creationTimestamp: Date;
  updateTimestamp: Date;
}
