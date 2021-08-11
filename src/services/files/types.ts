import { ReadStream } from 'fs';
import type {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';

/**
 * The combination of a uuid and id that is used to retrieve the file and decide an access level for the request
 */
export type Token = string;

export enum TokenPermission {
  FULL = 'full',
  READ = 'read',
}

export interface TokenObject {
  token?: Token;
  accessLevel?: TokenPermission;
}

export interface FileDetails {
  tokens?: Array<TokenObject>;
  creatorId?: ObjectId;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  name?: string;
  mimetype?: string;
  size?: number;
  tags?: Array<string>;
}

export interface CreateTokenRequest {
  accessLevel?: TokenPermission;
}

export interface FilesService {
  /**
   * List all files
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_FILES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<FileDetails>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<FileDetails>>;
  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findByName(name: string, options?: OptionsWithRql): Promise<FileDetails>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<FileDetails>;
  /**
   * Add a new file from a plain text source
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param string text
   * @returns FileDetails Success
   * @throws {FileTooLargeError}
   */
  createFromText(text: string, options?: OptionsBase): Promise<FileDetails>;
  /**
   * Add a new file
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param fileName string
   * @param fileData the file data
   * @returns FileDetails
   * @throws {FileTooLargeError}
   */
  create(
    fileName: string,
    fileData: Blob | Buffer | ReadStream,
    options?: OptionsBase & { tags: [] }
  ): Promise<FileDetails>;
  /**
   * Delete a file
   *
   * AccessLevel | Effect
   * - | -
   * `full` | **Required** to be able to delete the file
   * @param token
   * @returns AffectedRecords
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  remove(token: Token, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Retrieve a file from the object store
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param token
   * @returns Buffer
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  retrieve(token: Token, options?: OptionsBase): Promise<Buffer>;
  /**
   * Retrieve a file stream from the object store
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param token
   * @returns data as ReadStream
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  retrieveStream(
    token: Token,
    options?: OptionsBase
  ): Promise<{ data: ReadStream }>;
  /**
   * Get file details
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * AccessLevel | Effect
   * - | -
   * `full` | **Required** to return file metadata with all tokens.
   * `read` | **Required** to return name, size, mimetype.
   * @param token
   * @returns FileDetails
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  getDetails(token: Token, options?: OptionsBase): Promise<FileDetails>;
}

export interface FileTokensService {
  /**
   * Delete a token
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param token
   * @param tokenToAccess The token that should be deleted
   * @returns void
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   * @throws {TokenNotDeleteableError}
   */
  deleteToken(
    token: Token,
    tokenToAccess: Token,
    options?: OptionsBase
  ): Promise<void>;
  /**
   * Generate a token for a file
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param token
   * @param requestBody
   * @returns TokenObject Success
   * @throws {InvalidTokenError}
   * @throws {UnauthorizedTokenError}
   */
  generateToken(
    token: Token,
    requestBody: CreateTokenRequest,
    options?: OptionsBase
  ): Promise<TokenObject>;
}
