import { ObjectId } from '../models/ObjectId';
import { PagedResult } from '../models/Responses';

export interface UserData {
  id: string;
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
  creationTimestamp: number;
  updateTimestamp: number;
  profileImage: string;
}

export type PartialUserData = Partial<UserData>;

export type UserDataUpdate = Partial<
  Pick<
    UserData,
    'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'
  >
>;

interface PatientEnlistment {
  groupId: string;
  expiryTimestamp: Date;
  expired: boolean;
  creationTimestamp: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Array<Permission>;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface Permission {
  name: string;
  description: string;
}

interface StaffEnlistment {
  groupId: string;
  roles: Array<GroupRole>;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

interface GroupRole {
  groupId: string;
  name: string;
  description: string;
  permissions: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface UserDataList extends PagedResult {
  data: Array<UserData>;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birthday: string;
  gender: Gender;
  country: string;
  region?: string;
  language: string;
  timeZone?: string;
}

export interface PermissionDataList extends PagedResult {
  data: Array<Permission>;
}

export interface RolesDataList extends PagedResult {
  data: Array<Role>;
}

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  NotApplicable = 9,
}

export interface UserList extends PagedResult {
  data?: PartialUserData[];
}

export interface Email {
  email: string;
}

export interface AddPatientEnlistment {
  groupId: ObjectId;
  expiryTimestamp?: number;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface Authenticate {
  email: string;
  password: string;
}

export interface PasswordReset {
  hash?: string;
  newPassword: string;
}

export interface ConfirmPassword {
  password: string;
}
