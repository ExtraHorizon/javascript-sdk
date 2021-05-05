import { ObjectId } from '../models/ObjectId';
import { PagedResult } from '../models/Responses';
import { LanguageCode } from '../models/LanguageCode';
import { TimeZone } from '../models/TimeZone';

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  language: string;
  timeZone: string;
  email: string;
  phoneNumber: string;
  activation: boolean;
  patientEnlistments: PatientEnlistment[];
  roles: Role[];
  staffEnlistments: StaffEnlistment[];
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
  permissions: Permission[];
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface Permission {
  name: string;
  description: string;
}

export interface StaffEnlistment {
  groupId: string;
  roles: GroupRole[];
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface GroupRole {
  id: ObjectId;
  groupId: string;
  name: string;
  description: string;
  permissions: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface UserDataList extends PagedResult {
  data: UserData[];
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
  data: Permission[];
}

export interface RolesDataList extends PagedResult {
  data: Role[];
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

export interface GlobalPermission {
  name?: GlobalPermissionName;
  description?: string;
}

export interface GlobalPermissionsList extends PagedResult {
  data?: GlobalPermission[];
}

export enum GlobalPermissionName {
  VIEW_PRESCRIPTIONS = 'VIEW_PRESCRIPTIONS',
  CREATE_PRESCRIPTIONS = 'CREATE_PRESCRIPTIONS',
  DELETE_PRESCRIPTIONS = 'DELETE_PRESCRIPTIONS',
  VIEW_BALANCE = 'VIEW_BALANCE',
  VIEW_CREDIT_TRANSACTION = 'VIEW_CREDIT_TRANSACTION',
  UPDATE_GROUP = 'UPDATE_GROUP',
  DELETE_GROUP = 'DELETE_GROUP',
  VIEW_PATIENTS = 'VIEW_PATIENTS',
  ADD_PATIENT = 'ADD_PATIENT',
  REMOVE_PATIENT = 'REMOVE_PATIENT',
  VIEW_STAFF = 'VIEW_STAFF',
  ADD_STAFF = 'ADD_STAFF',
  REMOVE_STAFF = 'REMOVE_STAFF',
  CREATE_GROUP_ROLE = 'CREATE_GROUP_ROLE',
  UPDATE_GROUP_ROLE = 'UPDATE_GROUP_ROLE',
  DELETE_GROUP_ROLE = 'DELETE_GROUP_ROLE',
  ADD_GROUP_ROLE_PERMISSION = 'ADD_GROUP_ROLE_PERMISSION',
  REMOVE_GROUP_ROLE_PERMISSION = 'REMOVE_GROUP_ROLE_PERMISSION',
  ADD_GROUP_ROLE_TO_STAFF = 'ADD_GROUP_ROLE_TO_STAFF',
  REMOVE_GROUP_ROLE_FROM_STAFF = 'REMOVE_GROUP_ROLE_FROM_STAFF',
  VIEW_MEASUREMENTS = 'VIEW_MEASUREMENTS',
  UPDATE_MEASUREMENTS = 'UPDATE_MEASUREMENTS',
  TRANSITION_MEASUREMENTS = 'TRANSITION_MEASUREMENTS',
  DELETE_MEASUREMENTS = 'DELETE_MEASUREMENTS',
  CREATE_MEASUREMENT_COMMENTS = 'CREATE_MEASUREMENT_COMMENTS',
  VIEW_MEASUREMENT_COMMENTS = 'VIEW_MEASUREMENT_COMMENTS',
  UPDATE_PROFILES = 'UPDATE_PROFILES',
  DELETE_PROFILES = 'DELETE_PROFILES',
  CREATE_PROFILE_LOG_ENTRIES = 'CREATE_PROFILE_LOG_ENTRIES',
  VIEW_PROFILE_LOG_ENTRIES = 'VIEW_PROFILE_LOG_ENTRIES',
  UPDATE_GROUPS = 'UPDATE_GROUPS',
  CREATE_REPORTS = 'CREATE_REPORTS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  UPDATE_REPORTS = 'UPDATE_REPORTS',
  DELETE_REPORTS = 'DELETE_REPORTS',
  VIEW_GROUP_REPORT_CONFIGURATIONS = 'VIEW_GROUP_REPORT_CONFIGURATIONS',
  VIEW_PATIENT_REPORT_CONFIGURATIONS = 'VIEW_PATIENT_REPORT_CONFIGURATIONS',
  UPDATE_GROUP_REPORT_CONFIGURATIONS = 'UPDATE_GROUP_REPORT_CONFIGURATIONS',
  UPDATE_PATIENT_REPORT_CONFIGURATIONS = 'UPDATE_PATIENT_REPORT_CONFIGURATIONS',
  CREATE_REPORT_SHARES = 'CREATE_REPORT_SHARES',
  DELETE_REPORT_SHARES = 'DELETE_REPORT_SHARES',
}

export interface GroupRolePermissions {
  permissions: GlobalPermissionName[];
}

export interface Hash {
  hash: string;
}

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
  patientEnlistments?: PatientEnlistment[];
}

export interface RoleCreation {
  name: string;
  description: string;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
}

export interface RoleList extends PagedResult {
  data: Role[];
}

export interface GroupRoleList extends PagedResult {
  data: GroupRole[];
}

export interface AddRole {
  name: string;
  description: string;
}

export interface RolePermissions {
  permissions: GlobalPermissionName[];
}

export interface StaffGroups {
  groups: ObjectId[];
}

export interface StaffMember {
  id?: ObjectId;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  email?: string;
  phoneNumber?: string;
  timeZone?: TimeZone;
  staffEnlistments?: StaffEnlistment[];
}

export interface StaffRoles {
  roles: ObjectId[];
}

export interface UserRoles {
  roles: ObjectId[];
}
