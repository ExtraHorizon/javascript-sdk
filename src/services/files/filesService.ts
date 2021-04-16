import type { HttpInstance } from '../../types';
import { ResultResponse } from '../models/Responses';
import { Results } from '../models/Results';
import type { FilesList, CreateFileResponse, Token } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * List all files
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_FILES` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws {ApiError}
   */
  async find(rql = ''): Promise<FilesList> {
    return (await client.get(httpAuth, `/${rql}`)).data;
  },

  /**
   * Add a new file
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns CreateFileResponse Success
   * @throws {FileTooLargeException}
   */
  async createFile(requestBody?: any): Promise<CreateFileResponse> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Delete a file
   * AccessLevel | Effect
   * - | -
   * `full` | **Required** to be able to delete the file
   *
   * @param token
   * @returns void
   * @throws {InvalidTokenException}
   * @throws {UnauthorizedTokenException}
   */
  async deleteFile(token: Token): Promise<boolean> {
    const result: ResultResponse = await client.delete(httpAuth, `/${token}`);
    return result.status === Results.Success;
  },

  /**
   * Retrieve a file from the object store
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param token
   * @returns any Success
   * @throws {InvalidTokenException}
   * @throws {UnauthorizedTokenException}
   */
  async retrieveFile(token: Token): Promise<any> {
    return (await client.get(httpAuth, `/${token}/file`)).data;
  },

  /**
   * Get file details
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * AccessLevel | Effect
   * - | -
   * `full` | **Required** to return file metadata with all tokens.
   * `read` | **Required** to return name, size, mimetype.
   *
   * @param token
   * @returns CreateFileResponse Success
   * @throws {InvalidTokenException}
   * @throws {UnauthorizedTokenException}
   */
  async getFileDetails(token: Token): Promise<CreateFileResponse> {
    return (await client.get(httpAuth, `/${token}/details`)).data;
  },
});
