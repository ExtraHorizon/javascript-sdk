import { listResponse } from '../../models';
import { ObjectId } from './types';

export interface UserData extends DataAccessObject {
  id: ObjectId;
  firstName: string;
  lastName: string;
  language: string;
  timeZone: string;
  email: string;
  phoneNumber: string;
  activation: boolean;
  patientEnlistments: Array<PatientEnlistment>;
  roles: Array<Role>;
  staffEnlistments: Array<StaffEnlistment>;
  lastFailedTimestamp: number;
  failedCount: number;
  profileImage: string;
}

export interface PatientEnlistment extends DataAccessObject {
  groupId: ObjectId;
  expiryTimestamp: number;
  expired: boolean;
}

export interface Role extends DataAccessObject {
  id: ObjectId;
  name: string;
  description: string;
  permissions: Array<Permission>;
}

export interface Permission {
  name: string;
  description: string;
}

export interface StaffEnlistment extends DataAccessObject {
  groupId: ObjectId;
  roles: Array<GroupRole>;
}

export interface GroupRole extends DataAccessObject {
  groupId: ObjectId;
  name: string;
  description: string;
  permissions: string;
}

export interface UserDataList extends listResponse {
  data: Array<UserData>;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthday: string;
  gender: Gender;
  country: string;
  language: string;
  timeZone?: string;
}

export interface PermissionDataList extends listResponse {
  data: Array<Permission>;
}

export interface RolesDataList extends listResponse {
  data: Array<Role>;
}

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  NotApplicable = 9,
}

interface DataAccessObject {
  creationTimestamp: number;
  updateTimestamp?: number;
}
