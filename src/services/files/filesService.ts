import type { HttpInstance } from '../../types';
import type { FilesList, CreateFileResponse, Token } from './types';

export default (userClient, httpAuth: HttpInstance) => ({
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
    return (await userClient.get(httpAuth, `/${rql}`)).data;
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
    return (await userClient.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Delete a file
   * AccessLevel | Effect
   * - | -
   * `full` | **Required** to be able to delete the file
   *
   * @param token
   * @returns void
   * @throws {400 Error}
   * @throws {401 Error}
   */
  async deleteFile(token: Token): Promise<void> {
    await userClient.delete(httpAuth, `/${token}`);
  },

  /**
   * Retrieve a file from the object store
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param token
   * @returns any Success
   * @throws {400 Error}
   * @throws {401 Error}
   */
  async retrieveFile(token: Token): Promise<any> {
    return (await userClient.get(httpAuth, `/${token}/file`)).data;
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
   * @throws {400 Error}
   * @throws {401 Error}
   */
  async getFileDetails(token: Token): Promise<CreateFileResponse> {
    return (await userClient.get(httpAuth, `/${token}/details`)).data;
  },
});
