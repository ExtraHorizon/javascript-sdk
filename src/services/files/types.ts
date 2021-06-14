import { ReadStream } from 'fs';
import type { ObjectId } from '../types';

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

export interface CreateFile {
  name: string;
  extension?: string;
  file: Blob | Buffer | ReadStream;
  tags?: string[];
}
