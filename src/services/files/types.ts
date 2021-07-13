import { ReadStream } from 'fs';
import { RQLString } from '../../rql';
import type { AffectedRecords, ObjectId, PagedResult } from '../types';

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
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_FILES` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<FileDetails>
   */
  find(
    this: FilesService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<FileDetails>>;
  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findByName(
    this: FilesService,
    name: string,
    options?: { rql?: RQLString }
  ): Promise<FileDetails>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(
    this: FilesService,
    options?: { rql?: RQLString }
  ): Promise<FileDetails>;
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
  createFromText(this: FilesService, text: string): Promise<FileDetails>;
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
  create(
    this: FilesService,
    fileName: string,
    fileData: Blob | Buffer | ReadStream,
    options?: { tags: [] }
  ): Promise<FileDetails>;
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
  remove(this: FilesService, token: Token): Promise<AffectedRecords>;
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
  retrieve(this: FilesService, token: Token): Promise<Buffer>;
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
  retrieveStream(
    this: FilesService,
    token: Token
  ): Promise<{ data: ReadStream }>;
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
  getDetails(this: FilesService, token: Token): Promise<FileDetails>;
}

export interface FileTokensService {
  /**
   * Delete a token
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
    this: FileTokensService,
    token: Token,
    tokenToAccess: Token
  ): Promise<void>;
  /**
   * Generate a token for a file
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
    this: FileTokensService,
    token: Token,
    requestBody: CreateTokenRequest
  ): Promise<TokenObject>;
}
