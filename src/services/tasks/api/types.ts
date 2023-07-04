import { OptionsBase } from '../../types';
import { ApiFunctionRequestMethod } from '../apiRequests/types';

export interface ApiService {
  /**
   * ## Execute a GET request towards an API function
   *
   * **Default Permissions:**
   * - Any party may execute API functions with the `public` permission mode
   * - Any authenticated user may execute API functions with the `allUsers` permission mode
   *
   * **Global Permissions:**
   * - `EXECUTE_API_FUNCTION` - A user may execute all API functions
   * - `EXECUTE_API_FUNCTION:{FUNCTION_NAME}` - A user may execute the API function specified by the FUNCTION_NAME
   *
   *  @template T
   *  @param functionName {@link string} - The functionName property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param options {@link OptionsBase} - Additional options for the request.
   *  @returns {T} - A user defined type defining the response from the API function
   */
  get<T>(functionName: string, path: string, options: OptionsBase): Promise<T>;

  /**
   * ## Execute a POST request towards an API function
   *
   * **Default Permissions:**
   * - Any party may execute API functions with the `public` permission mode
   * - Any authenticated user may execute API functions with the `allUsers` permission mode
   *
   * **Global Permissions:**
   * - `EXECUTE_API_FUNCTION` - A user may execute all API functions
   * - `EXECUTE_API_FUNCTION:{FUNCTION_NAME}` - A user may execute the API function specified by the FUNCTION_NAME
   *
   *  @param functionName {@link string} - The functionName property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param data {@link U} - The data to be sent to the Function, the type may be user defined
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  post<T, U>(
    functionName: string,
    path: string,
    data: U,
    options: OptionsBase
  ): Promise<T>;

  /**
   * ## Execute a PUT request towards an API function
   *
   * **Default Permissions:**
   * - Any party may execute API functions with the `public` permission mode
   * - Any authenticated user may execute API functions with the `allUsers` permission mode
   *
   * **Global Permissions:**
   * - `EXECUTE_API_FUNCTION` - A user may execute all API functions
   * - `EXECUTE_API_FUNCTION:{FUNCTION_NAME}` - A user may execute the API function specified by the FUNCTION_NAME
   *
   *  @param functionName {@link string} - The functionName property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param data {@link U} - The data to be sent to the Function, the type may be user defined
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  put<T, U>(
    functionName: string,
    path: string,
    data: U,
    options: OptionsBase
  ): Promise<T>;

  /**
   * ## Execute a DELETE request towards an API function
   *
   * **Default Permissions:**
   * - Any party may execute API functions with the `public` permission mode
   * - Any authenticated user may execute API functions with the `allUsers` permission mode
   *
   * **Global Permissions:**
   * - `EXECUTE_API_FUNCTION` - A user may execute all API functions
   * - `EXECUTE_API_FUNCTION:{FUNCTION_NAME}` - A user may execute the API function specified by the FUNCTION_NAME
   *
   *  @param functionName {@link string} - The functionName property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  delete<T>(
    functionName: string,
    path: string,
    options: OptionsBase
  ): Promise<T>;

  /**
   * ## Execute a PATCH request towards an API function
   *
   * **Default Permissions:**
   * - Any party may execute API functions with the `public` permission mode
   * - Any authenticated user may execute API functions with the `allUsers` permission mode
   *
   * **Global Permissions:**
   * - `EXECUTE_API_FUNCTION` - A user may execute all API functions
   * - `EXECUTE_API_FUNCTION:{FUNCTION_NAME}` - A user may execute the API function specified by the FUNCTION_NAME
   *
   *  @param functionName {@link string} - The functionName property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param data {@link U} - The data to be sent to the Function, the type may be user defined
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  patch<T, U>(
    functionName: string,
    path: string,
    data: U,
    options: OptionsBase
  ): Promise<T>;
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
  body?: any;
  /**
   * The isBase64Encoded field must be set to true if the body field of the response object is a Base64 encoded string representing the raw response body.
   * */
  isBase64Encoded?: boolean;
}
