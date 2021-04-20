import type { ReadStream } from 'fs';
import * as FormData from 'form-data';
import type { HttpInstance } from '../../types';
import { ResultResponse } from '../models/Responses';
import { Results } from '../models/Results';
import type { FilesList, FileDetails, Token, CreateFile } from './types';
import { RQLString } from '../../rql';

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
  async find(rql?: RQLString): Promise<FilesList> {
    return (await client.get(httpAuth, `/${rql || ''}`)).data;
  },

  /**
   * Add a new file
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns FileDetails Success
   * @throws {FileTooLargeError}
   */
  async createFile({ name, file, tags }: CreateFile): Promise<FileDetails> {
    const form = new FormData();
    form.append('name', name);
    form.append('file', file);
    if (tags) {
      form.append('tags', tags);
    }
    return (
      await client.post(httpAuth, '/', form, { headers: form.getHeaders() })
    ).data;
  },

  /**
   * Delete a file
   * AccessLevel | Effect
   * - | -
   * `full` | **Required** to be able to delete the file
   *
   * @param token
   * @returns void
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
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
   * @returns arraybuffer Success
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  async retrieveFile(token: Token): Promise<Buffer> {
    return (
      await client.get(httpAuth, `/${token}/file`, {
        responseType: 'arraybuffer',
      })
    ).data;
  },

  /**
   * Retrieve a file stream from the object store
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param token
   * @returns ReadStream Success
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  async retrieveFileStream(token: Token): Promise<{ data: ReadStream }> {
    return await client.get(httpAuth, `/${token}/file`, {
      responseType: 'stream',
    });
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
   * @returns FileDetails Success
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  async getFileDetails(token: Token): Promise<FileDetails> {
    return (await client.get(httpAuth, `/${token}/details`)).data;
  },
});
