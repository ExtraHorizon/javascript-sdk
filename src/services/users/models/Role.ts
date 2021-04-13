import type { GlobalPermission } from './GlobalPermission';
import type { ObjectId } from '../../models/ObjectId';

export interface Role {
  id?: ObjectId;
  name?: string;
  description?: string;
  permissions?: Array<GlobalPermission>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}
