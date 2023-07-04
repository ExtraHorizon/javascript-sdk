import { ApiRequestLogsService } from './logs/types';
import { ObjectId, OptionsWithRql, PagedResultWithPager } from '../../types';
import { FindAllIterator } from '../../helpers';

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
  /** The Extra Horizon user id */
  userId: ObjectId;
  /** The Extra Horizon application id */
  applicationId: ObjectId;
  /** The status code of the API Function's response */
  statusCode: number;
  /** The time the API Function was executed */
  timestamp: Date;
  error: ApiRequestError;
}

export interface ApiRequestError {
  /** The Extra Horizon error name */
  name: string;
  /** The Extra Horizon error message */
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

export enum ApiFunctionRequestMethod {
  'GET' = 'GET',
  'POST' = 'POST',
  'PUT' = 'PUT',
  'DELETE' = 'DELETE',
  'PATCH' = 'PATCH',
  'OPTIONS' = 'OPTIONS',
  'HEAD' = 'HEAD',
}

export interface ApiFunctionRequestObject {
  /** The payload formation version of the AWS API Gateway. */
  version: '2.0';
  /** The path portion of the URL that comes after the Function name. */
  rawPath: string;
  /** The unprocessed query string of the incoming HTTP request including the starting question mark. */
  rawQueryString: string;
  /**
   * The headers of the incoming HTTP request.
   * It is structured as an object, where each key-value pair corresponds to a header name and its value.
   * */
  headers: Record<string, string>;
  requestContext: {
    http: {
      /**  The HTTP method used to target the API function. */
      method: ApiFunctionRequestMethod;
    };
  };
  /** The body of the incoming HTTP request as string. It can be Base64-encoded based on the isBase64Encoded property. */
  body: string;
  /** The isBase64Encoded property indicates if the body property of the request object has been Base64-encoded. */
  isBase64Encoded: boolean;
}

export interface ApiFunctionResponseObject {
  /**
   * The statusCode field resolves to the status code in the HTTP response.
   * The value can be in the 200 - 499 range.
   * */
  statusCode: number;
  /**
   * The headers field resolves to the headers in the HTTP response.
   * It is structured as an object, where each key-value pair corresponds to a header name and its value.
   * */
  headers?: Record<string, string>;
  /**
   * The body field resolves to the body in the HTTP response.
   * In order to include binary data within a body, such as images or audio files, it is necessary to convert it into a Base64 string and assign it to the body field of the response object. Additionally, the isBase64Encoded field must be set to true.
   * If the response body does not contain binary data, you can directly include the data in its original format.
   */
  body?: string;
  /**
   * The isBase64Encoded field must be set to true if the body field of the response object is a Base64 encoded string representing the raw response body.
   * */
  isBase64Encoded?: boolean;
}
