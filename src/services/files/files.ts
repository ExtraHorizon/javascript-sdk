import type { ReadStream } from 'fs';
import FormData from 'form-data';
import type { HttpInstance } from '../../types';
import { ResultResponse, Results, PagedResult } from '../types';
import type { FileDetails, Token, CreateFile } from './types';
import { RQLString, rqlBuilder } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * List all files
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_FILES` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<FileDetails>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findByName(name: string, rql?: RQLString): Promise<FileDetails> {
    const rqlWithName = rqlBuilder(rql).eq('name', name).build();
    const res = (await client.get(httpAuth, `/${rqlWithName}`)).data;
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(rql?: RQLString): Promise<FileDetails> {
    const res = (await client.get(httpAuth, `/${rql || ''}`)).data;
    return res.data[0];
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
  async create({
    name,
    file,
    tags,
    extension = 'pdf',
  }: CreateFile): Promise<FileDetails> {
    const form = new FormData();
    form.append('name', name);
    form.append('file', file, `${name}.${extension}`);
    if (tags) {
      form.append('tags', tags);
    }
    return (
      await client.post(httpAuth, '/', form, {
        headers:
          typeof window === 'undefined'
            ? form.getHeaders()
            : { 'Content-Type': 'multipart/form-data' },
      })
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
  async delete(token: Token): Promise<boolean> {
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
  async retrieve(token: Token): Promise<Buffer> {
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
  async retrieveStream(token: Token): Promise<{ data: ReadStream }> {
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
  async getDetails(token: Token): Promise<FileDetails> {
    return (await client.get(httpAuth, `/${token}/details`)).data;
  },
});
