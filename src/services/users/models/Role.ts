import type { GlobalPermission } from './GlobalPermission';
import type { ObjectId } from '../../models/ObjectId';
import type { PagedResult } from '../../models/Responses';

export interface Role {
  id?: ObjectId;
  name?: string;
  description?: string;
  permissions?: Array<GlobalPermission>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface GroupRole extends Role {
  groupId?: ObjectId;
}
export interface RoleCreation {
  name: string;
  description: string;
}
export interface RoleUpdate {
  name?: string;
  description?: string;
}

export interface RoleList extends PagedResult {
  data: Role[];
}
export interface GroupRoleList extends PagedResult {
  data: GroupRole[];
}

export interface AddRole {
  name: string;
  description: string;
}
