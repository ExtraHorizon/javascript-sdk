import { listResponse } from "../../models";

interface DAO {
  creationTimestamp: number;
  updateTimestamp?: number;
}

export interface UserData extends DAO {
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
  profileImage: string;
}

interface PatientEnlistment extends DAO {
  groupId: string;
  expiryTimestamp: number;
  expired: boolean;
}

export interface Role extends DAO {
  id: string;
  name: string;
  description: string;
  permissions: Array<Permission>;
}

export interface Permission {
  name: string;
  description: string;
}

interface StaffEnlistment extends DAO {
  groupId: string;
  roles: Array<GroupRole>;
}

interface GroupRole extends DAO {
  groupId: string;
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
