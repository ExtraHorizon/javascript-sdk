/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from '../../models/ObjectId';
import type { StaffEnlistment } from './StaffEnlistment';
import type { TimeZone } from '../../models/TimeZone';

export type StaffMember = {
    id?: ObjectId;
    first_name?: string;
    last_name?: string;
    profile_image?: string;
    email?: string;
    phone_number?: string;
    time_zone?: TimeZone;
    staff_enlistments?: Array<StaffEnlistment>;
}
