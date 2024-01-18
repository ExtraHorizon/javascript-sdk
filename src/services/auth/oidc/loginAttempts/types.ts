import { OptionsWithRql, PagedResultWithPager } from '../../../types';
import { FindAllIterator } from '../../../helpers';

export interface LoginAttemptsService {
  /**
   * ## Retrieve a paged list of login attempts
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_LOGIN_ATTEMPTS` - Allows a user to view login attempts
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns A paged list of login attempts {@link PagedResultWithPager PagedResultWithPager<LoginAttempt>}
   */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<LoginAttempt>>;

  /**
   * ## Retrieve a list of all login attempts
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_LOGIN_ATTEMPTS` - Allows a user to view login attempts
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An array of login attempts {@link LoginAttempt LoginAttempt[]}
   * @throws {@link Error} Do not pass in limit operator with findAll
   */
  findAll(options?: OptionsWithRql): Promise<LoginAttempt[]>;

  /**
   * ## Retrieve a paged list of login attempts
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_LOGIN_ATTEMPTS` - Allows a user to view login attempts
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An iterator for the queried login attempts {@link FindAllIterator FindAllIterator<LoginAttempt>}
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<LoginAttempt>;

  /**
   * ## Retrieve the first queried login attempt
   *
   * **Global Permissions:**
   * - `VIEW_OIDC_LOGIN_ATTEMPTS` - Allows a user to view login attempts
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns The first element of the queried login attempts {@link LoginAttempt}
   */
  findFirst(options?: OptionsWithRql): Promise<LoginAttempt>;
}

export enum LoginAttemptStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface LoginAttempt {
  /** The Extra Horizon document id */
  id: string;
  /** The (success / failed) status of a login attempt. */
  status: LoginAttemptStatus;
  /** The id of the provider */
  providerId: string;
  /** The unique name of the provider */
  providerName: string;
  /** The subject id (sub) of the user for the given provider */
  providerSubjectId: string;
  /** The Extra Horizon user id */
  userId: string;
  /** An Extra Horizon formatted error for failed requests */
  error: {
    name: string;
    message: string;
    code: number;
  };
  /** The date and time of the login attempt */
  creationTimestamp: Date;
}
