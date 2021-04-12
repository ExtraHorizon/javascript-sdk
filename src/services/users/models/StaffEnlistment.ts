import type { ObjectId } from '../../models/ObjectId';

export interface StaffEnlistment {
  groupId?: string;
  roles?: Array<{
    groupId?: ObjectId;
    name?: string;
    description?: string;
    permissions?: Array<string>;
    creationTimestamp?: number;
    updateTimestamp?: number;
  }>;
  creationTimestamp?: number;
  updateTimestamp?: number;
}
