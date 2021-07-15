import type { ReadStream } from 'fs';
import FormData from 'form-data';
import type { HttpInstance } from '../../types';
import {
  ResultResponse,
  Results,
  AffectedRecords,
  PagedResult,
} from '../types';
import type { FileDetails, FilesService, Token } from './types';
import { RQLString, rqlBuilder } from '../../rql';
import { createCustomFormData, generateBoundary } from './formHelpers';
import { addPagers } from '../utils';

export default (client, httpAuth: HttpInstance): FilesService => ({
  /**
   * List all files
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_FILES` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<FileDetails>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<FileDetails>> {
    const result = (await client.get(httpAuth, `/${options?.rql || ''}`)).data;

    return addPagers.call(this, [], options, result);
  },

  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findByName(
    name: string,
    options?: { rql?: RQLString }
  ): Promise<FileDetails> {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ rql: rqlWithName });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<FileDetails> {
    const res = await this.find(options);
    return res.data[0];
  },

  /**
   * Add a new file from a plain text source
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param string text
   * @returns FileDetails Success
   * @throws {FileTooLargeError}
   */
  async createFromText(text: string): Promise<FileDetails> {
    const boundary = generateBoundary();
    const formData = createCustomFormData(text, boundary);

    return (
      await client.post(httpAuth, '/', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
      })
    ).data;
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
  async create(
    fileName: string,
    fileData: Blob | Buffer | ReadStream,
    options?: { tags: [] }
  ): Promise<FileDetails> {
    const form = new FormData();
    if (typeof window !== 'undefined' && !(fileData instanceof Blob)) {
      throw new Error(
        'In the frontend you should use Blob. https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob'
      );
    }
    form.append('name', fileName);
    form.append('file', fileData, fileName);

    if (options?.tags && options.tags.length > 0) {
      form.append('tags', options.tags);
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
   * @returns AffectedRecords
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  async remove(token: Token): Promise<AffectedRecords> {
    const result: ResultResponse = await client.delete(httpAuth, `/${token}`);
    const affectedRecords = result.status === Results.Success ? 1 : 0;
    return { affectedRecords };
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
