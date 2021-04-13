import type { PatientEnlistment } from './PatientEnlistment';
import type { LanguageCode } from '../../models/LanguageCode';
import type { ObjectId } from '../../models/ObjectId';
import type { TimeZone } from '../../models/TimeZone';

export interface Patient {
  id?: ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  activation?: boolean;
  phoneNumber?: string;
  profileImage?: string;
  language?: LanguageCode;
  timeZone?: TimeZone;
  patientEnlistments?: Array<PatientEnlistment>;
}
