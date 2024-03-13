import { ObjectId, OptionsWithRql } from '../../../types';
import { LogLine } from '../../logs/types';

export interface ApiRequestLogsService {
  /**
   * ## Retrieve a list of logs for an API Request
   *
   * **Global Permissions:**
   * - `VIEW_API_FUNCTION_REQUEST_LOGS` - **Required** for this endpoint
   *
   * @param apiRequestId {@link string} The id of the targeted API Request
   * @param options {@link OptionsWithRql} - Additional options for the request
   * @returns An array of API Request logs {@link LogLine LineLog[]}
   */
  find(apiRequestId: ObjectId, options?: OptionsWithRql): Promise<LogLine[]>;

  /**
   * ## Retrieve the first queried API Request log
   *
   * **Global Permissions:**
   * - `VIEW_API_FUNCTION_REQUEST_LOGS` - **Required** for this endpoint
   *
   * @param apiRequestId {@link string} The id of the targeted API Request
   * @param options {@link OptionsWithRql} - Additional options for the request
   * @returns The first element of the queried API Request logs {@link LogLine}     */
  findFirst(apiRequestId: ObjectId, options?: OptionsWithRql): Promise<LogLine>;
}
