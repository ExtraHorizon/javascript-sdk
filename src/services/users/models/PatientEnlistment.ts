/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from '../../models/ObjectId';

export type PatientEnlistment = {
    group_id?: ObjectId;
    expiry_timestamp?: number;
    expired?: boolean;
    creation_timestamp?: number;
}
