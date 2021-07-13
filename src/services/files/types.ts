import { ReadStream } from 'fs';
import { RQLString } from '../../rql';
import type { AffectedRecords, ObjectId, PagedResultWithPager } from '../types';

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
  find(
    this: FilesService,
    options?: { rql?: RQLString }
  ): Promise<PagedResultWithPager<FileDetails>>;
  findByName(
    this: FilesService,
    name: string,
    options?: { rql?: RQLString }
  ): Promise<FileDetails>;
  findFirst(
    this: FilesService,
    options?: { rql?: RQLString }
  ): Promise<FileDetails>;
  createFromText(this: FilesService, text: string): Promise<FileDetails>;
  create(
    this: FilesService,
    fileName: string,
    fileData: Blob | Buffer | ReadStream,
    options?: { tags: [] }
  ): Promise<FileDetails>;
  remove(this: FilesService, token: Token): Promise<AffectedRecords>;
  retrieve(this: FilesService, token: Token): Promise<Buffer>;
  retrieveStream(
    this: FilesService,
    token: Token
  ): Promise<{ data: ReadStream }>;
  getDetails(this: FilesService, token: Token): Promise<FileDetails>;
}

export interface FileTokensService {
  deleteToken(
    this: FileTokensService,
    token: Token,
    tokenToAccess: Token
  ): Promise<void>;
  generateToken(
    this: FileTokensService,
    token: Token,
    requestBody: CreateTokenRequest
  ): Promise<TokenObject>;
}
