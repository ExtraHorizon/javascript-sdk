/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageCode } from './LanguageCode';
import type { ObjectId } from './ObjectId';
import type { PatientEnlistment } from './PatientEnlistment';
import type { Role } from './Role';
import type { StaffEnlistment } from './StaffEnlistment';
import type { TimeZone } from './TimeZone';

export type FullUser = {
    id?: ObjectId;
    first_name?: string;
    last_name?: string;
    email?: string;
    activation?: boolean;
    phone_number?: string;
    profile_image?: string;
    language?: LanguageCode;
    time_zone?: TimeZone;
    last_failed_timestamp?: number;
    failed_count?: number;
    patient_enlistments?: Array<PatientEnlistment>;
    staff_enlistment?: Array<StaffEnlistment>;
    roles?: Array<Role>;
    creation_timestamp?: number;
    update_timestamp?: number;
}
