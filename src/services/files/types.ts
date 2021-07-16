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
  find(
    this: FilesService,
    options?: OptionsWithRql
  ): Promise<PagedResult<FileDetails>>;
  findByName(
    this: FilesService,
    name: string,
    options?: OptionsWithRql
  ): Promise<FileDetails>;
  findFirst(this: FilesService, options?: OptionsWithRql): Promise<FileDetails>;
  createFromText(
    this: FilesService,
    text: string,
    options?: OptionsBase
  ): Promise<FileDetails>;
  create(
    this: FilesService,
    fileName: string,
    fileData: Blob | Buffer | ReadStream,
    options?: OptionsBase & { tags: [] }
  ): Promise<FileDetails>;
  remove(
    this: FilesService,
    token: Token,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  retrieve(
    this: FilesService,
    token: Token,
    options?: OptionsBase
  ): Promise<Buffer>;
  retrieveStream(
    this: FilesService,
    token: Token,
    options?: OptionsBase
  ): Promise<{ data: ReadStream }>;
  getDetails(
    this: FilesService,
    token: Token,
    options?: OptionsBase
  ): Promise<FileDetails>;
}

export interface FileTokensService {
  deleteToken(
    this: FileTokensService,
    token: Token,
    tokenToAccess: Token,
    options?: OptionsBase
  ): Promise<void>;
  generateToken(
    this: FileTokensService,
    token: Token,
    requestBody: CreateTokenRequest,
    options?: OptionsBase
  ): Promise<TokenObject>;
}
