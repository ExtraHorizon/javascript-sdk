/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageCode } from './LanguageCode';
import type { ObjectId } from './ObjectId';
import type { PatientEnlistment } from './PatientEnlistment';
import type { TimeZone } from './TimeZone';

export type Patient = {
    id?: ObjectId;
    first_name?: string;
    last_name?: string;
    email?: string;
    activation?: boolean;
    phone_number?: string;
    profile_image?: string;
    language?: LanguageCode;
    time_zone?: TimeZone;
    patient_enlistments?: Array<PatientEnlistment>;
}
