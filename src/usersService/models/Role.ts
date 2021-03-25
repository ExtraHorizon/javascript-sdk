/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GlobalPermission } from './GlobalPermission';
import type { ObjectId } from './ObjectId';

export type Role = {
    id?: ObjectId;
    name?: string;
    description?: string;
    permissions?: Array<GlobalPermission>;
    creation_timestamp?: number;
    update_timestamp?: number;
}
