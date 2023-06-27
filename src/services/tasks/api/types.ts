import { OptionsBase } from '../../types';

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
   *  @param name {@link string} - The name property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param options {@link OptionsBase} - Additional options for the request.
   *  @returns {T} - A user defined type defining the response from the API function
   */
  get<T>(name: string, path: string, options: OptionsBase): Promise<T>;

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
   *  @param name {@link string} - The name property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param data {@link U} - The data to be sent to the Function, the type may be user defined
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  post<T, U>(
    name: string,
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
   *  @param name {@link string} - The name property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param data {@link U} - The data to be sent to the Function, the type may be user defined
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  put<T, U>(
    name: string,
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
   *  @param name {@link string} - The name property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  delete<T>(name: string, path: string, options: OptionsBase): Promise<T>;

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
   *  @param name {@link string} - The name property serves as the unique identifier amongst all Functions
   *  @param path {@link string} - The targeted route within the Function
   *  @param data {@link U} - The data to be sent to the Function, the type may be user defined
   *  @param options {@link OptionsBase} - Additional options for the request
   *  @returns {@link T} - The response return from the Function, the type may be user defined
   */
  patch<T, U>(
    name: string,
    path: string,
    data: U,
    options: OptionsBase
  ): Promise<T>;
}
