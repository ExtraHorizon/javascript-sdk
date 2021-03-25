/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';

export type StaffEnlistment = {
    group_id?: string;
    roles?: Array<{
        group_id?: ObjectId,
        name?: string,
        description?: string,
        permissions?: Array<string>,
        creation_timestamp?: number,
        update_timestamp?: number,
    }>;
    creation_timestamp?: number;
    update_timestamp?: number;
}
