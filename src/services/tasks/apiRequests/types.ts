import { FindAllIterator } from '../../helpers';
import { ObjectId, OptionsWithRql, PagedResultWithPager } from '../../types';
import { ApiFunctionRequestMethod } from '../api/types';
import { ApiRequestLogsService } from './logs/types';

export interface ApiRequestService {
  /**
   * ## Retrieve a paged list of API Requests
   *
   * **Global Permissions:**
   * - `VIEW_API_FUNCTION_REQUESTS` - Allows a user to view API Requests
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns A paged list of API Requests {@link PagedResultWithPager PagedResultWithPager<ApiRequest>}
   */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<ApiRequest>>;

  /**
   * ## Retrieve a list of all API Requests
   *
   * **Global Permissions:**
   * - `VIEW_API_FUNCTION_REQUESTS` - Allows a user to view API Requests
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An array of API Requests {@link ApiRequest ApiRequest[]}
   * @throws {@link Error} Do not pass in limit operator with findAll
   */
  findAll(options?: OptionsWithRql): Promise<ApiRequest[]>;

  /**
   * ## Retrieve a paged list of API Requests
   *
   * **Global Permissions:**
   * - `VIEW_API_FUNCTION_REQUESTS` - Allows a user to view API Requests
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An iterator for the queried API Requests {@link FindAllIterator FindAllIterator<ApiRequest>}
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<ApiRequest>;

  /**
   * ## Retrieve the first queried API Request
   *
   * **Global Permissions:**
   * - `VIEW_API_FUNCTION_REQUESTS` - Allows a user to view API Requests
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns The first element of the queried API Requests {@link ApiRequest}
   */
  findFirst(options?: OptionsWithRql): Promise<ApiRequest>;
  logs: ApiRequestLogsService;
}

export interface ApiRequest {
  /** The Extra Horizon document id */
  id: ObjectId;
  /** The unique identifier amongst all Functions */
  functionName: string;
  /**  The HTTP method used to target the API function. */
  method: ApiFunctionRequestMethod;
  /** The path portion of the URL that comes after the Function name. */
  path: string;
  /** The id of the user making the request */
  userId?: ObjectId;
  /** The application id of the oAuth application */
  applicationId?: ObjectId;
  /** The status code of the API Function's response or of a thrown error during its lifecycle */
  statusCode: number;
  /** The time the API Function was executed */
  timestamp: Date;
  /** The duration of the API Function execution in seconds */
  duration: number;
  /** An error thrown during the lifecycle of the API Function's execution  */
  error?: ApiRequestError;
}

export interface ApiRequestError {
  /** The name of the caught error */
  name: string;
  /** The message of the caught error */
  message: string;
  /** The error type defines where the error occurred during the API Function lifecycle and can have one of the following values:
   * - `invocation` - errors that occur before invocation of the API Function
   * - `runtime` - errors that occur during the execution of the API Function
   * - `response` - errors that occur during the response validation after the API Function has been executed
   */
  type: ApiRequestErrorType;
}

export enum ApiRequestErrorType {
  INVOCATION = 'invocation',
  RUNTIME = 'runtime',
  RESPONSE = 'response',
}
