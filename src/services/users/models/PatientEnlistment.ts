import type { ObjectId } from '../../models/ObjectId';

export type PatientEnlistment = {
    groupId?: ObjectId;
    expiryTimestamp?: number;
    expired?: boolean;
    creationTimestamp?: number;
}
