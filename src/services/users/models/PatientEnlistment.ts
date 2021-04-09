import type { ObjectId } from '../../models/ObjectId';

export interface PatientEnlistment {
    groupId?: ObjectId;
    expiryTimestamp?: number;
    expired?: boolean;
    creationTimestamp?: number;
}
