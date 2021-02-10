import { listResponse } from '../models';

export interface UserData {
  id:string,
  firstName: string,
  lastName: string,
  language: string,
  timeZone: string,
  email: string,
  phoneNumber:string,
  activation: boolean,
  patientEnlistments: Array <PatientEnlistment>,
  roles: Array<Role>,
  staffEnlistments: Array<StaffEnlistment>,
  lastFailedTimestamp: number,
  failedCount: number,
  creationTimestamp: number,
  updateTimestamp: number,
  profileImage: string
}

interface PatientEnlistment {
  groupId: string;
  expiryTimestamp: number;
  expired: boolean;
  creationTimestamp: number;
}

interface Role {
  id: string,
  name: string,
  description: string,
  permissions: Array<Permission>
  creationTimestamp: number;
  updateTimestamp: number;
}

interface Permission {
  name: string;
  description: string;
}

interface StaffEnlistment {
  groupId: string;
  roles: Array <GroupRole>;
  creationTimestamp: number;
  updateTimestamp: number;
}

interface GroupRole {
  groupId: string;
  name: string;
  description: string;
  permissions: string;
  creationTimestamp: number;
  updateTimestamp: number;
}

export interface UserDataList extends listResponse {
  data: Array<UserData>
}

export interface RegisterUserData {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: string,
  birthday: string,
  gender: number,
  country: string,
  language: string,
  timeZone?: string,
}
