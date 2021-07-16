import FormData from 'form-data';
import type { HttpInstance } from '../../types';
import { ResultResponse, Results } from '../types';
import type { FilesService } from './types';
import { rqlBuilder } from '../../rql';
import { createCustomFormData, generateBoundary } from './formHelpers';
import { HttpClient } from '../http-client';

export default (client: HttpClient, httpAuth: HttpInstance): FilesService => ({
  /**
   * List all files
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_FILES` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<FileDetails>
   */
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  },

  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findByName(name, options) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ ...options, rql: rqlWithName });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options) {
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
  async createFromText(text, options) {
    const boundary = generateBoundary();
    const formData = createCustomFormData(text, boundary);

    return (
      await client.post(httpAuth, '/', formData, {
        headers: {
          ...(options?.headers ? options.headers : {}),
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
  async create(fileName, fileData, options) {
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
        headers: {
          ...(options?.headers ? options.headers : {}),
          ...(typeof window === 'undefined'
            ? form.getHeaders()
            : { 'Content-Type': 'multipart/form-data' }),
        },
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
  async remove(token, options) {
    const result: ResultResponse = await client.delete(
      httpAuth,
      `/${token}`,
      options
    );
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
  async retrieve(token, options) {
    return (
      await client.get(httpAuth, `/${token}/file`, {
        ...options,
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
  async retrieveStream(token, options) {
    return await client.get(httpAuth, `/${token}/file`, {
      ...options,
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
  async getDetails(token, options) {
    return (await client.get(httpAuth, `/${token}/details`, options)).data;
  },
});
