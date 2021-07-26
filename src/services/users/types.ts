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
  /**
   * Retrieve a list of permissions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns PagedResult<GlobalPermission>
   */
  getPermissions(
    this: UsersGlobalRolesService
  ): Promise<PagedResult<GlobalPermission>>;
  /**
   * Retrieve a list of roles
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Role>
   */
  get(
    this: UsersGlobalRolesService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Role>>;
  /**
   * Create a role
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_ROLE` | `global` | **Required** for this endpoint
   *
   * @param requestBody The role data
   * @returns Role
   */
  create(
    this: UsersGlobalRolesService,
    requestBody: RoleCreation
  ): Promise<Role>;
  /**
   * Delete a role
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_ROLE` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  remove(
    this: UsersGlobalRolesService,
    rql: RQLString
  ): Promise<AffectedRecords>;
  /**
   * Update a role
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ROLE` | `global` | **Required** for this endpoint
   *
   * @param id Id of the targeted role
   * @param requestBody
   * @returns Role Success
   */
  update(
    this: UsersGlobalRolesService,
    id: ObjectId,
    requestBody: RoleUpdate
  ): Promise<Role>;
  /**
   * Add permissions to a role
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_ROLE_PERMISSIONS` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  addPermissions(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: RolePermissions
  ): Promise<AffectedRecords>;
  /**
   * Remove permissions from roles
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_ROLE_PERMISSIONS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  removePermissions(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: RolePermissions
  ): Promise<AffectedRecords>;
  /**
   * Add roles to users
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_ROLE_TO_USER` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns any Operation successful
   */
  addToUsers(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords>;
  /**
   * Remove roles from users
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_ROLE_FROM_USER` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   */
  removeFromUser(
    this: UsersGlobalRolesService,
    rql: RQLString,
    requestBody: UserRoles
  ): Promise<AffectedRecords>;
}

export interface UsersGroupRolesService {
  /**
   * Retrieve a list of group permissions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns PagedResult<GlobalPermission>
   */
  getPermissions(
    this: UsersGroupRolesService
  ): Promise<PagedResult<GlobalPermission>>;
  /**
   * Retrieve a list of group roles
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the roles for the group
   * `VIEW_GROUP` | `global` | View any group its roles
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @returns PagedResult<GroupRole>
   */
  get(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<GroupRole>>;
  /**
   * Add role to a group
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_GROUP_ROLE` | `staff enlistment` | Create a role for any group
   * `CREATE_GROUP_ROLE` | `global` | Create a role for the group
   *
   * @param groupId Id of the targeted group
   * @param requestBody The role to add
   * @returns GroupRole
   */
  add(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: AddRole
  ): Promise<GroupRole>;
  /**
   * Update a group role
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_GROUP_ROLE` | `staff enlistment` | Update a role for the group
   * `UPDATE_GROUP_ROLE` | `global` | Update a role for any group
   *
   * @param groupId Id of the targeted group
   * @param roleId Id of the targeted role
   * @param requestBody The role data to update
   * @returns GroupRole
   * @throws {ResourceUnknownError}
   */
  update(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    roleId: ObjectId,
    requestBody: AddRole
  ): Promise<GroupRole>;
  /**
   * Remove a role from a group
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_GROUP_ROLE` | `staff enlistment` | Delete a role for the group
   * `DELETE_GROUP_ROLE` | `global` | Delete a role from any group
   *
   * @param groupId Id of the targeted group
   * @param roleId Id of the targeted role
   * @param rql Add filters to the requested list.
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  remove(
    this: UsersGroupRolesService,
    rql: RQLString,
    groupId: ObjectId,
    roleId: ObjectId
  ): Promise<AffectedRecords>;
  /**
   * Add permissions to group roles
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_GROUP_ROLE_PERMISSION` | `staff enlistment` | Add permissions to roles of the group
   * `ADD_GROUP_ROLE_PERMISSION` | `global` | Add permissions to roles of any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  addPermissions(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: GroupRolePermissions,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  /**
   * Remove permissions from group roles
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_GROUP_ROLE_PERMISSION` | `staff enlistment` | Remove permissions from roles of the group
   * `REMOVE_GROUP_ROLE_PERMISSION` | `global` | Remove permissions from roles of any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  removePermissions(
    this: UsersGroupRolesService,
    rql: RQLString,
    groupId: ObjectId,
    requestBody: GroupRolePermissions
  ): Promise<AffectedRecords>;
  /**
   * Assign roles to staff members of a group
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_GROUP_ROLE_TO_STAFF` | `staff enlistment` | Assign roles for the group
   * `ADD_GROUP_ROLE_TO_STAFF` | `global` | Assign roles for any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  assignToStaff(
    this: UsersGroupRolesService,
    groupId: ObjectId,
    requestBody: StaffRoles,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  /**
   * Remove roles from staff members of a group
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_GROUP_ROLE_FROM_STAFF` | `staff enlistment` | Remove roles from staff of the group
   * `REMOVE_GROUP_ROLE_FROM_STAFF` | `global` | Remove roles from staff of any group
   *
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  removeFromStaff(
    this: UsersGroupRolesService,
    rql: RQLString,
    groupId: ObjectId,
    requestBody: StaffRoles
  ): Promise<AffectedRecords>;
  /**
   * Add users to staff
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_STAFF` | `staff enlistment` | Add staff to the group
   * `ADD_STAFF` | `global` | Add staff to any group
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  addUsersToStaff(
    this: UsersGroupRolesService,
    requestBody: StaffGroups,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;

  /**
   * Remove users from staff
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_STAFF` | `staff enlistment` | Remove staff from the group
   * `ADD_STAFF` | `global` | Remove staff from any group
   *
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  removeUsersFromStaff(
    this: UsersGroupRolesService,
    rql: RQLString,
    requestBody: StaffGroups
  ): Promise<AffectedRecords>;
}

export interface UsersService {
  /**
   * Retrieve the current logged in user
   * @permission Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  me(this: UsersService): Promise<User>;
  /**
   * Retrieve a specific user
   * @params {string} userId of the targeted user (required)
   * @permission See your own user object
   * @permission --------- | scope:group  | See a subset of the fields for any staff member or patient of the group
   * @permission VIEW_PATIENTS | scope:global | See a subset of fields for any user with a patient enlistment
   * @permission VIEW_STAFF | scope:global | See a subset of fields for any user with a staff enlistment
   * @permission VIEW_USER | scope:global | See any user object
   * @throws {ResourceUnknownError}
   * @returns {UserData} UserData
   */
  findById(this: UsersService, userId: string): Promise<User>;
  /**
   * Update a specific user
   * @params {string} userId of the targeted user (required)
   * @params {Pick<UserData,'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'>} data Fields to update
   * @permission Update your own data
   * @permission UPDATE_USER | scope:global | Update any user
   * @throws {ResourceUnknownError}
   * @returns {UserData} UserData
   */
  update(
    this: UsersService,
    userId: string,
    userData: UserDataUpdate
  ): Promise<User>;
  /**
   * Retrieve a list of users
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See a limited set of fields of the staff members (of the groups where you are enlisted as a patient)
   * none | `staff enlistment` | See a limited set of fields of all patients and staff members (of the groups where you are enlisted as staff member)
   * `VIEW_USER` | `global` | See all fields of all users
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<User>
   */
  find(
    this: UsersService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<User>>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(this: UsersService, options?: { rql?: RQLString }): Promise<User>;
  /**
   * @deprecated
   * Delete a list of users
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete your own user (object)
   * `DELETE_USER` | `global` | Delete any user
   *
   * @param rql Add filters to the requested list.
   * @returns any Operation successful
   */
  removeUsers(this: UsersService, rql: RQLString): Promise<AffectedRecords>;
  /**
   * Retrieve a list of users that have a patient enlistment
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the patients of the group
   * `VIEW_PATIENTS` | `global`  | View all patients
   *
   * @param rql Add filters to the requested list.
   * @returns Patient Success
   */
  patients(
    this: UsersService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Patient>>;
  /**
   * Retrieve a list of users that have a staff enlistment
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the other staff members of the group
   * `VIEW_STAFF` | `global`  | View all staff members
   *
   * @param rql Add filters to the requested list.
   * @returns StaffMember Success
   */
  staff(
    this: UsersService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<StaffMember>>;
  /**
   * Delete a specific user
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete your own user object
   * `DELETE_USER` | `global` | Delete any user
   *
   * @param userId Id of the targeted user
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  remove(this: UsersService, userId: ObjectId): Promise<AffectedRecords>;
  /**
   * Update the email address of a specific user
   * An email is send to validate and activate the new address.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own data
   * `UPDATE_USER_EMAIL` | `global` | Update any user
   *
   * @param userId Id of the targeted user
   * @param requestBody
   * @returns FullUser Success
   * @throws {EmailUsedError}
   * @throws {ResourceUnknownError}
   */
  updateEmail(
    this: UsersService,
    userId: ObjectId,
    requestBody: Email
  ): Promise<User>;
  /**
   * Add a patient enlistment to a user
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_PATIENT` | `global` | **Required** for this endpoint
   *
   * @param userId Id of the targeted user
   * @param requestBody
   * @returns any Operation successful
   * @throws {ResourceAlreadyExistsError}
   */
  addPatientEnlistment(
    this: UsersService,
    userId: ObjectId,
    requestBody: AddPatientEnlistment
  ): Promise<AffectedRecords>;
  /**
   * Remove a patient enlistment from a user
   * Permission | Scope | Effect
   * - | - | -
   * none | | Remove a patient enlistment from yourself
   * `REMOVE_PATIENT` | `staff enlistment` | Remove a patient enlistment for the group
   * `REMOVE_PATIENT` | `global` | Remove any patient enlistment
   *
   * @param userId Id of the targeted user
   * @param groupId Id of the targeted group
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  removePatientEnlistment(
    this: UsersService,
    userId: ObjectId,
    groupId: ObjectId
  ): Promise<AffectedRecords>;
  /**
   * Create an account
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns FullUser Success
   * @throws {EmailUsedError}
   */
  createAccount(
    this: UsersService,
    requestBody: RegisterUserData
  ): Promise<User>;
  /**
   * Change your password
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns FullUser Success
   * @throws {PasswordError}
   */
  changePassword(
    this: UsersService,
    requestBody: ChangePassword
  ): Promise<User>;
  /**
   * Authenticate a user
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns FullUser Success
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   */
  authenticate(this: UsersService, requestBody: Authenticate): Promise<User>;
  /**
   * Request an email activation
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param email
   * @returns {boolean} Success
   * @throws {EmailUnknownError}
   * @throws {AlreadyActivatedError}
   */
  requestEmailActivation(this: UsersService, email: string): Promise<boolean>;
  /**
   * Complete an email activation
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns {boolean} Success
   * @throws {ActivationUnknownError}
   */
  validateEmailActivation(
    this: UsersService,
    requestBody: Hash
  ): Promise<boolean>;
  /**
   * Request a password reset
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param email
   * @returns {boolean} Success
   * @throws {EmailUnknownError}
   * @throws {NotActivatedError}
   */
  requestPasswordReset(this: UsersService, email: string): Promise<boolean>;
  /**
   * Complete a password reset
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody
   * @returns true if completed a password reset
   * @throws {NotActivatedError}
   * @throws {NewPasswordHashUnknownError}
   */
  validatePasswordReset(
    this: UsersService,
    requestBody: PasswordReset
  ): Promise<boolean>;
  /**
   * Confirm the password for the user making the request
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody the password to confirm
   * @returns true if password was confirmed
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   */
  confirmPassword(
    this: UsersService,
    requestBody: ConfirmPassword
  ): Promise<boolean>;
  /**
   * Check if an email address is still available
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param email
   * @returns emailAvailable will be true on success
   */
  isEmailAvailable(
    this: UsersService,
    email: string
  ): Promise<{
    emailAvailable: boolean;
  }>;
  /**
   * Update the profile image of a user
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own profile image
   * `UPDATE_PROFILE_IMAGE` | `global` | Update any user its profile image
   *
   * @deprecated this method is deprecated in swagger
   * @param userId Id of the targeted user
   * @param requestBody
   * @returns FullUser Success
   * @throws {ResourceUnknownError}
   */
  updateProfileImage(
    this: UsersService,
    userId: ObjectId,
    requestBody: Hash
  ): Promise<User>;
  /**
   * Delete the profile image of a user
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete your own profile image
   * `UPDATE_PROFILE_IMAGE` | `global` | Delete any user its profile image
   *
   * @param userId Id of the targeted user
   * @returns FullUser Success
   * @throws {ResourceUnknownError}
   */
  deleteProfileImage(this: UsersService, userId: ObjectId): Promise<User>;
}
