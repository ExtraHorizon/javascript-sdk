import { listResponse } from '../models';

export interface UserData {
  id: string,
  firstName: string,
  lastName: string,
  language: string,
  timeZone: string,
  email: string,
  phoneNumber: string,
  activation: boolean,
  patientEnlistments: Array<PatientEnlistment>,
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

export interface Role {
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
  roles: Array<GroupRole>;
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
  gender: Gender,
  country: string,
  language: string,
  timeZone?: string,
}

export interface PermissionDataList extends listResponse {
  data: Array<Permission>
}

export interface RolesDataList extends listResponse {
  data: Array<Role>
}

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  NotApplicable = 9,
}

interface Error {
  code: number;
  name: string;
  message: string;
}

export const ResourceUnknownException: Error = {
  code: 16,
  name: "RESOURCE_UNKNOWN_EXCEPTION",
  message: "Requested resource is unknown",
}

export const AuthenticationException: Error = {
  code: 106,
  name: "AUTHENTICATION_EXCEPTION",
  message: "This password email combination is unknown"
}

export const EmailUnknownException: Error = {
  code: 202,
  name: "EMAIL_UNKNOWN_EXCEPTION",
  message: "This email is not known"
}

export const EmailUsedException: Error = {
  code: 203,
  name: "EMAIL_USED_EXCEPTION",
  message: "This email address is already in use"
}

export const ResourceAlreadyExistsException: Error = {
  code: 203,
  name: "RESOURCE_ALREADY_EXISTS_EXCEPTION",
  message: "This resource already exists"
}

export const NotActivatedException: Error = {
  code: 204,
  name: "NOT_ACTIVATED_EXCEPTION",
  message: "This account needs to be activated before this action can be performed"
}

export const ActivationUnknownException: Error = {
  code: 205,
  name: "ACTIVATION_UNKNOWN_EXCEPTION",
  message: "This activation does not exist"
}

export const AlreadyActivatedException: Error = {
  code: 206,
  name: "ALREADY_ACTIVATED_EXCEPTION",
  message: "This user is already activated"
}

export const NewPasswordHashUnknownException: Error = {
  code: 207,
  name: "NEW_PASSWORD_HASH_UNKNOWN_EXCEPTION",
  message: "This new password hash does not exist"
}

export const PasswordException: Error = {
  code: 208,
  name: "PASSWORD_EXCEPTION",
  message: "The provided password is not correct"
}

export const LoginTimeoutException: Error = {
  code: 211,
  name: "LOGIN_TIMEOUT_EXCEPTION",
  message: "Login attempt too fast"
}

export const LoginFreezeException: Error = {
  code: 212,
  name: "LOGIN_FREEZE_EXCEPTION",
  message: "Login timeout in progress, too many failed login attempts"
}

export const TooManyFailedAttemptsException: Error = {
  code: 213,
  name: "TOO_MANY_FAILED_ATTEMPTS_EXCEPTION",
  message: "Account is locked due to too many failed login attempts"
}
