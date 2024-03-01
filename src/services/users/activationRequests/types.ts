import { AffectedRecords, OptionsBase, OptionsWithRql, PagedResult } from '../../types';

export interface ActivationRequestsService {
  /**
   * Retrieve a list of activation requests
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ACTIVATION_REQUESTS` | global | **Required** for this endpoint
   */
  find(options?: OptionsWithRql): Promise<PagedResult<ActivationRequest>>;

  /**
   * Find an activation request
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ACTIVATION_REQUESTS` | global | **Required** for this endpoint
   */
  findFirst(options?: OptionsWithRql): Promise<ActivationRequest>;

  /**
   * Find an activation request by its id
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ACTIVATION_REQUESTS` | global | **Required** for this endpoint
   */
  findById(id: string, options?: OptionsWithRql): Promise<ActivationRequest>;

  /**
   * Find an activation request for a user id
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ACTIVATION_REQUESTS` | global | **Required** for this endpoint
   */
  findByUserId(userId: string, options?: OptionsWithRql): Promise<ActivationRequest>;

  /**
   * Remove an activation request
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_ACTIVATION_REQUEST` | global | **Required** for this endpoint
   */
  remove(id: string, options?: OptionsBase): Promise<AffectedRecords>;
}

export interface ActivationRequest {
  id: string;
  userId: string;
  mode?: 'hash' | 'pin_code';

  /**
   * The amount of times the account activation flow was initiated without completion.
   */
  requestCount?: number;

  /**
   * The last time the account activation flow was initiated.
   */
  lastRequestTimestamp?: number;

  /**
   * (Pin code mode only) the amount of attempts with an incorrect pin code for the current activation request.
   */
  failedAttempts?: number;

  /**
   * (Pin code mode only) the last time an incorrect pin code for the current activation request.
   */
  lastFailedAttemptTimestamp?: Date;

  /**
   * The time until which the activation request can be used.
   */
  expiryTimestamp?: Date;

  creationTimestamp: Date;
  updateTimestamp: Date;
}
