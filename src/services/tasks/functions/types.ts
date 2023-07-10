import { OptionsBase } from '../../types';
import { Task } from '../types';

export interface FunctionsService {
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

export interface DirectExecutionResponse<T, U> extends Task<U> {
  /** The result of the Function execution, this may be user defined */
  result: T;
}
