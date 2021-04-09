/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageCode } from '../../models/LanguageCode';
import type { ObjectId } from '../../models/ObjectId';
import type { PatientEnlistment } from './PatientEnlistment';
import type { TimeZone } from '../../models/TimeZone';

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
