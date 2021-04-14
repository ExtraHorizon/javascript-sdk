import type { PagedResult } from '../../models/Responses';
import type { GlobalPermissionName } from './GlobalPermissionName';

export interface GlobalPermission {
  name?: GlobalPermissionName;
  description?: string;
}

export interface GlobalPermissionsList extends PagedResult {
  data?: GlobalPermission[];
}
