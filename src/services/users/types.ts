import { RQLString } from '../../rql';
import {
  ObjectId,
  LanguageCode,
  TimeZone,
  PagedResult,
  AffectedRecords,
} from '../types';

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  language: LanguageCode;
  timeZone: TimeZone;
  email: string;
  phoneNumber: string;
  activation: boolean;
  patientEnlistments: PatientEnlistment[];
  roles: Role[];
  staffEnlistments: StaffEnlistment[];
  lastFailedTimestamp: Date;
  failedCount: number;
  profileImage: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export type User = Partial<UserData>;

export type UserDataUpdate = Partial<
  Pick<
    UserData,
    'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'
  >
>;

export interface PatientEnlistment {
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

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthday: string;
  gender: Gender;
  country: string;
  region?: string;
  language: string;
  timeZone?: string;
}

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  NotApplicable = 9,
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

export interface UsersGlobalRolesService {
  getPermissions(
    this: UsersGlobalRolesService
  ): Promise<PagedResult<GlobalPermission>>;
  get(
    this: UsersGlobalRolesService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Role>>;
  create(
    this: UsersGlobalRolesService,
    requestBody: RoleCreation
  ): Promise<Role>;
  delete(
    this: UsersGlobalRolesService,
    rql: RQLString
  ): Promise<AffectedRecords>;
  update(
    this: UsersGlobalRolesService,
    id: ObjectId,
    requestBody: RoleUpdate
  ): Promise<Role>;
  addPermissions(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: RolePermissions
  ): Promise<AffectedRecords>;
  removePermissions(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: RolePermissions
  ): Promise<AffectedRecords>;
  addToUsers(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords>;
  removeFromUser(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords>;
}

export interface UsersGroupRolesService {
  getPermissions(
    this: UsersGroupRolesService
  ): Promise<PagedResult<GlobalPermission>>;
  get(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<GroupRole>>;
  add(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: AddRole
  ): Promise<GroupRole>;
  update(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    roleId: ObjectId,
    requestBody: AddRole
  ): Promise<GroupRole>;
  remove(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    roleId: ObjectId,
    rql: RQLString
  ): Promise<AffectedRecords>;
  addPermissions(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: GroupRolePermissions,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  removePermissions(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: GroupRolePermissions,
    rql: RQLString
  ): Promise<AffectedRecords>;
  assignToStaff(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: StaffRoles,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  removeFromStaff(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: StaffRoles,
    rql: RQLString
  ): Promise<AffectedRecords>;
  addUsersToStaff(
    this: UsersGroupRolesService,
    requestBody: StaffGroups,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  removeUsersFromStaff(
    this: UsersGroupRolesService,
    requestBody: StaffGroups,
    rql: RQLString
  ): Promise<AffectedRecords>;
}

export interface UsersService {
  me(this: UsersService): Promise<User>;
  findById(this: UsersService, userId: string): Promise<User>;
  update(
    this: UsersService,
    userId: string,
    userData: UserDataUpdate
  ): Promise<User>;
  find(
    this: UsersService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<User>>;
  removeUsers(this: UsersService, rql: RQLString): Promise<AffectedRecords>;
  patients(
    this: UsersService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Patient>>;
  staff(
    this: UsersService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<StaffMember>>;
  remove(this: UsersService, userId: ObjectId): Promise<AffectedRecords>;
  updateEmail(
    this: UsersService,
    userId: ObjectId,
    requestBody: Email
  ): Promise<User>;
  addPatientEnlistment(
    this: UsersService,
    userId: ObjectId,
    requestBody: AddPatientEnlistment
  ): Promise<AffectedRecords>;
  removePatientEnlistment(
    this: UsersService,
    userId: ObjectId,
    groupId: ObjectId
  ): Promise<AffectedRecords>;
  createAccount(
    this: UsersService,
    requestBody: RegisterUserData
  ): Promise<User>;
  changePassword(
    this: UsersService,
    requestBody: ChangePassword
  ): Promise<User>;
  authenticate(this: UsersService, requestBody: Authenticate): Promise<User>;
  requestEmailActivation(this: UsersService, email: string): Promise<boolean>;
  validateEmailActivation(
    this: UsersService,
    requestBody: Hash
  ): Promise<boolean>;
  requestPasswordReset(this: UsersService, email: string): Promise<boolean>;
  validatePasswordReset(
    this: UsersService,
    requestBody: PasswordReset
  ): Promise<boolean>;
  confirmPassword(
    this: UsersService,
    requestBody: ConfirmPassword
  ): Promise<boolean>;
  isEmailAvailable(
    this: UsersService,
    email: string
  ): Promise<{
    emailAvailable: boolean;
  }>;
  updateProfileImage(
    this: UsersService,
    userId: ObjectId,
    requestBody: Hash
  ): Promise<User>;
  deleteProfileImage(this: UsersService, userId: ObjectId): Promise<User>;
}
