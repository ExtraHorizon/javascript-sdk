import type { ObjectId } from '../../models/ObjectId';
import type { TimeZone } from '../../models/TimeZone';
import type { StaffEnlistment } from './StaffEnlistment';

export interface StaffMember {
    id?: ObjectId;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    email?: string;
    phoneNumber?: string;
    timeZone?: TimeZone;
    staffEnlistments?: Array<StaffEnlistment>;
}
