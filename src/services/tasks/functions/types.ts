import { OptionsBase, type AffectedRecords, type PagedResult } from '../../types';
import { Task } from '../types';

export interface FunctionsService {
  /**
   * View a list of functions.
   *
   * Although this endpoint is a paged-like endpoint, it will return all functions in a single page.
   * RQL is not supported for this endpoint, and any RQL provided will be ignored.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TASK_FUNCTIONS` | `global` | **Required** for this endpoint
   */
  find(options?: OptionsBase): Promise<PagedResult<FunctionBase>>;

  /**
   * View a list of functions.
   *
   * Although this endpoint is a paged-like endpoint, it will return all functions in a single page.
   * RQL is not supported for this endpoint, and any RQL provided will be ignored.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TASK_FUNCTIONS` | `global` | **Required** for this endpoint
   */
  create(body: FunctionCreation, options?: OptionsBase): Promise<FunctionDetails>;

  /**
   * View details of a function by its name.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TASK_FUNCTION_DETAILS` | `global` | **Required** for this endpoint
   *
   * @throws {ResourceUnknownError} When no function with the specified name is found
   */
  getByName(name: string, options?: OptionsBase): Promise<FunctionDetails>;

  /**
   * Update a function by its name.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_TASK_FUNCTION` | `global` | **Required** for this endpoint
   *
   * @throws {ResourceUnknownError} When no function with the specified name is found
   */
  update(name: string, body: Partial<FunctionCreation>, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * Delete a function by its name.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_TASK_FUNCTION` | `global` | **Required** for this endpoint
   *
   * @throws {ResourceUnknownError} When no function with the specified name is found
   */
  delete(name: string, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * Enable a function by its name.
   *
   * Does nothing if the function is already enabled.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_TASK_FUNCTION` | `global` | **Required** for this endpoint
   *
   * @throws {ResourceUnknownError} When no function with the specified name is found
   */
  enable(name: string, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * Disable a function by its name.
   *
   * Does nothing if the function is already disabled.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_TASK_FUNCTION` | `global` | **Required** for this endpoint
   *
   * @throws {ResourceUnknownError} When no function with the specified name is found
   */
  disable(name: string, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * ## Execute a Function directly
   *
   * A Function may be executed directly, the function will be executed synchronously and the response may be awaited by the caller.
   *
   * **Default Permissions:**
   * - Any party may execute Functions with the `public` permission mode
   * - Any authenticated user may execute Functions with the `allUsers` permission mode
   *
   * **Global Permissions:**
   * - `EXECUTE_TASK_FUNCTION` - A user may execute all Functions
   * - `EXECUTE_TASK_FUNCTION:{FUNCTION_NAME}` - A user may execute the Function specified by the FUNCTION_NAME
   *
   * @param functionName {@link string} - The functionName property serves as the unique identifier amongst all Functions
   * @param data {@link U} - The data to be sent to the Function, the type may be specified by the user
   * @param options {@link OptionsBase} - Additional options for the request
   * @returns {@link DirectExecutionResponse} - The response returned from the Function, the response data and results may be user defined
   */
  execute<T = any, U = any>(
    functionName: string,
    data?: U,
    options?: OptionsBase
  ): Promise<DirectExecutionResponse<T, U>>;
}

export interface FunctionBase {
  /** The name of the Function */
  name: string;

  /** A description of the Function */
  description: string;

  /** The timestamp when the Function was last updated */
  updateTimestamp: Date;
}

export interface FunctionCreation {
  /** The name of the Function, this serves as the unique identifier amongst all Functions */
  name: string;

  /** A description of the Function */
  description?: string;

  /** Base64 Encoded binary value of the compressed (.zip) function code */
  code: string;

  /** Entry point for execution of the function, e.g. `index.handler` */
  entryPoint: string;

  /**
   * The runtime environment for the Function, e.g. `nodejs24.x`
   * The supported runtimes can be found in the [task service documentation](https://docs.extrahorizon.com/extrahorizon/services/automation/task-service/functions#runtime)
   */
  runtime: string;

  /**
   * Maximum execution time (seconds) of the function.
   * Should be between 3 and 300 seconds, defaults to 30 seconds if not provided.
   */
  timeLimit?: number;

  /**
   * Memory limit (MB) for the function.
   * Should be between 128 and 10240, defaults to 128 if not provided.
   */
  memoryLimit?: number;

  /** Environment variables to be made available to the function during execution */
  environmentVariables?: {
    [key: string]: { value: string; };
  };

  /** Options related to the execution of the function, such as permission an priority */
  executionOptions?: {
    /** Defines access for executing the function directly or for invoking it as an API function. */
    permissionMode?: FunctionPermissionMode;

    /** The default priority assigned to all tasks created for this function, unless a priority is specified for a task explicitly */
    defaultPriority?: number;
  };

  /** The policy that determines system behavior after the execution of a Function fails. */
  retryPolicy?: {
    /**
     * The retry policy is disabled by default, If this field is set to true, the retry policy becomes active.
     * If active the policy will retry a maximum of 3 times, with an increasing timeout of 2, 5 and 10 seconds respectively.
     */
    enabled: boolean;

    /** A list of error names that should trigger a retry. If not specified, the default is to retry on all errors. */
    errorsToRetry: string[];
  };
}

export type FunctionDetails = Omit<FunctionCreation, 'code'> & FunctionBase & {
  /** Indicates whether the function is enabled or disabled for execution/invocation. Enabled by default. */
  enabled: boolean;
};

export enum FunctionPermissionMode {
  /** To execute this function directly the user needs the EXECUTE_TASK_FUNCTION permission */
  PERMISSION_REQUIRED = 'permissionRequired',

  /** Every logged in user can execute this function directly */
  ALL_USERS = 'allUsers',

  /** The function can be executed even by unauthenticated requests */
  PUBLIC = 'public',
}

export interface DirectExecutionResponse<T, U> extends Task<U> {
  /** The result of the Function execution, this may be user defined */
  result: T;
}
