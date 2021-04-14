import { ObjectId } from '../models/ObjectId';
import { PagedResult } from '../models/Responses';

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

export interface CreateFileResponse {
  tokens?: Array<TokenObject>;
  creatorId?: ObjectId;
  creationTimestamp?: string;
  updateTimestamp?: string;
  name?: string;
  mimetype?: string;
  size?: number;
  tags?: Array<string>;
}

export interface FilesList extends PagedResult {
  data: Array<CreateFileResponse>;
}

export interface CreateTokenRequest {
  accessLevel?: TokenPermission;
}
