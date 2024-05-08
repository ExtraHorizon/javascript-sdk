import { RQLString } from '../../rql';
import { FindAllIterator } from '../../services/helpers';
import {
  ObjectId,
  LanguageCode,
  TimeZone,
  PagedResult,
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
  PagedResultWithPager,
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
  patientEnlistments?: PatientEnlistment[];
  roles?: Role[];
  staffEnlistments?: StaffEnlistment[];
  lastFailedTimestamp?: Date;
  failedCount?: number;
  profileImage?: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export type User = UserData;

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
  permissions?: Permission[];
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface Permission {
  name: string;
  description: string;
}

export interface StaffEnlistment {
  groupId: string;
  roles?: GroupRole[];
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface GroupRole {
  id: ObjectId;
  groupId: string;
  name: string;
  description: string;
  permissions: string[];
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthday?: string;
  gender?: Gender;
  country?: string;
  region?: string;
  language: string;
  timeZone?: string;

  /** The activation mode to use. Defaults to `hash`. */
  activationMode?: 'hash' | 'pin_code' | 'manual';
}

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  NotApplicable = 9,
}

export interface EmailUpdate {
  email: string;
  activationMode?: 'hash' | 'pin_code' | 'manual';
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

export type ActivationCompletion = ActivationHashCompletion | ActivationPinCodeCompletion;

export interface ActivationHashCompletion {
  hash: string;
}

export interface ActivationPinCodeCompletion {
  email: string;
  pinCode: string;
}

export type PasswordResetCompletion = PasswordResetHashCompletion | PasswordResetPinCodeCompletion;

export interface PasswordResetHashCompletion {
  hash: string;
  newPassword: string;
}

export interface PasswordResetPinCodeCompletion {
  email: string;
  pinCode: string;
  newPassword: string;
}

export interface ConfirmPassword {
  password: string;
}

export interface GlobalPermission {
  name?: GlobalPermissionName;
  description?: string;
}
export interface PasswordPolicy {
  minimumLength: number;
  maximumLength: number;
  upperCaseRequired: boolean;
  lowerCaseRequired: boolean;
  symbolRequired: boolean;
  numberRequired: boolean;
  pattern?: string;
  messageFormat?: string;
}

export enum GlobalPermissionName {
  ACTIVATE_PRESCRIPTIONS = 'ACTIVATE_PRESCRIPTIONS',
  ADD_CREDITS = 'ADD_CREDITS',
  ADD_GROUP_ROLE_PERMISSION = 'ADD_GROUP_ROLE_PERMISSION',
  ADD_GROUP_ROLE_TO_STAFF = 'ADD_GROUP_ROLE_TO_STAFF',
  ADD_PATIENT = 'ADD_PATIENT',
  ADD_ROLE_PERMISSION = 'ADD_ROLE_PERMISSION',
  ADD_ROLE_TO_USER = 'ADD_ROLE_TO_USER',
  ADD_STAFF = 'ADD_STAFF',
  APPROVE_GROUP_REQUESTS = 'APPROVE_GROUP_REQUESTS',
  ASSUME_PAYMENT_ENTITY = 'ASSUME_PAYMENT_ENTITY',
  CANCEL_TASKS = 'CANCEL_TASKS',
  CREATE_APP_STORE_SHARED_SECRET = 'CREATE_APP_STORE_SHARED_SECRET',
  CREATE_APP_STORE_SUBSCRIPTION_PRODUCT = 'CREATE_APP_STORE_SUBSCRIPTION_PRODUCT',
  CREATE_APPLICATIONS = 'CREATE_APPLICATIONS',
  CREATE_DISPATCHERS = 'CREATE_DISPATCHERS',
  CREATE_DOCUMENT_COMMENTS = 'CREATE_DOCUMENT_COMMENTS',
  CREATE_DOCUMENTS = 'CREATE_DOCUMENTS',
  CREATE_EVENTS = 'CREATE_EVENTS',
  CREATE_GROUP = 'CREATE_GROUP',
  CREATE_GROUP_ROLE = 'CREATE_GROUP_ROLE',
  CREATE_LOCALIZATIONS = 'CREATE_LOCALIZATIONS',
  CREATE_NOTIFICATIONS = 'CREATE_NOTIFICATIONS',
  CREATE_OIDC_PROVIDER = 'CREATE_OIDC_PROVIDER',
  CREATE_PACKAGES = 'CREATE_PACKAGES',
  CREATE_PAYMENT_INTENTS = 'CREATE_PAYMENT_INTENTS',
  CREATE_PLAY_STORE_SUBSCRIPTION_PRODUCT = 'CREATE_PLAY_STORE_SUBSCRIPTION_PRODUCT',
  CREATE_PRESCRIPTIONS = 'CREATE_PRESCRIPTIONS',
  CREATE_PROFILE_LOG_ENTRIES = 'CREATE_PROFILE_LOG_ENTRIES',
  CREATE_PROFILES = 'CREATE_PROFILES',
  CREATE_REPORT_SHARES = 'CREATE_REPORT_SHARES',
  CREATE_REPORTS = 'CREATE_REPORTS',
  CREATE_ROLE = 'CREATE_ROLE',
  CREATE_SCHEMAS = 'CREATE_SCHEMAS',
  CREATE_SMS_MESSAGE = 'CREATE_SMS_MESSAGE',
  CREATE_STRIPE_PRODUCTS = 'CREATE_STRIPE_PRODUCTS',
  CREATE_SUBSCRIPTIONS = 'CREATE_SUBSCRIPTIONS',
  CREATE_TASK_FUNCTION = 'CREATE_TASK_FUNCTION',
  CREATE_TASK_SCHEDULE = 'CREATE_TASK_SCHEDULE',
  CREATE_TASKS = 'CREATE_TASKS',
  CREATE_TEMPLATES = 'CREATE_TEMPLATES',
  DELETE_ACTIVATION_REQUEST = 'DELETE_ACTIVATION_REQUEST',
  DELETE_APP_STORE_SHARED_SECRET = 'DELETE_APP_STORE_SHARED_SECRET',
  DELETE_APP_STORE_SUBSCRIPTION = 'DELETE_APP_STORE_SUBSCRIPTION',
  DELETE_APP_STORE_SUBSCRIPTION_PRODUCT = 'DELETE_APP_STORE_SUBSCRIPTION_PRODUCT',
  DELETE_APPLICATIONS = 'DELETE_APPLICATIONS',
  DELETE_AUTHORIZATIONS = 'DELETE_AUTHORIZATIONS',
  DELETE_DISPATCHERS = 'DELETE_DISPATCHERS',
  DELETE_DOCUMENTS = 'DELETE_DOCUMENTS',
  DELETE_FORGOT_PASSWORD_REQUEST = 'DELETE_FORGOT_PASSWORD_REQUEST',
  DELETE_GROUP = 'DELETE_GROUP',
  DELETE_GROUP_ROLE = 'DELETE_GROUP_ROLE',
  DELETE_LOCALIZATIONS = 'DELETE_LOCALIZATIONS',
  DELETE_MAILS = 'DELETE_MAILS',
  DELETE_NOTIFICATIONS = 'DELETE_NOTIFICATIONS',
  DELETE_OIDC_PROVIDER = 'DELETE_OIDC_PROVIDER',
  DELETE_PACKAGES = 'DELETE_PACKAGES',
  DELETE_PLAY_STORE_SUBSCRIPTION = 'DELETE_PLAY_STORE_SUBSCRIPTION',
  DELETE_PLAY_STORE_SUBSCRIPTION_PRODUCT = 'DELETE_PLAY_STORE_SUBSCRIPTION_PRODUCT',
  DELETE_REPORT_SHARES = 'DELETE_REPORT_SHARES',
  DELETE_REPORTS = 'DELETE_REPORTS',
  DELETE_ROLE = 'DELETE_ROLE',
  DELETE_SCHEMAS = 'DELETE_SCHEMAS',
  DELETE_SMS_MESSAGE = 'DELETE_SMS_MESSAGE',
  DELETE_STRIPE_PRODUCTS = 'DELETE_STRIPE_PRODUCTS',
  DELETE_TASK_FUNCTION = 'DELETE_TASK_FUNCTION',
  DELETE_TASK_SCHEDULE = 'DELETE_TASK_SCHEDULE',
  DELETE_TEMPLATES = 'DELETE_TEMPLATES',
  DELETE_USER = 'DELETE_USER',
  DISABLE_SCHEMAS = 'DISABLE_SCHEMAS',
  EXECUTE_API_FUNCTION = 'EXECUTE_API_FUNCTION',
  EXECUTE_TASK_FUNCTION = 'EXECUTE_TASK_FUNCTION',
  PAY_PRESCRIPTIONS = 'PAY_PRESCRIPTIONS',
  PRERENDER_REPORTS = 'PRERENDER_REPORTS',
  REMOVE_GROUP_ROLE_FROM_STAFF = 'REMOVE_GROUP_ROLE_FROM_STAFF',
  REMOVE_GROUP_ROLE_PERMISSION = 'REMOVE_GROUP_ROLE_PERMISSION',
  REMOVE_PATIENT = 'REMOVE_PATIENT',
  REMOVE_ROLE_FROM_USER = 'REMOVE_ROLE_FROM_USER',
  REMOVE_ROLE_PERMISSION = 'REMOVE_ROLE_PERMISSION',
  REMOVE_STAFF = 'REMOVE_STAFF',
  RESET_FAILED_LOGIN_ATTEMPTS = 'RESET_FAILED_LOGIN_ATTEMPTS',
  SEND_MAILS = 'SEND_MAILS',
  SYNC_PROFILE_GROUPS = 'SYNC_PROFILE_GROUPS',
  TRANSFER_PERIOD = 'TRANSFER_PERIOD',
  TRIGGER_APP_STORE_SUBSCRIPTION_REEVALUATION = 'TRIGGER_APP_STORE_SUBSCRIPTION_REEVALUATION',
  TRIGGER_PLAY_STORE_SUBSCRIPTION_REEVALUATION = 'TRIGGER_PLAY_STORE_SUBSCRIPTION_REEVALUATION',
  UNLINK_USER_FROM_OIDC = 'UNLINK_USER_FROM_OIDC',
  UPDATE_ACCESS_TO_DOCUMENT = 'UPDATE_ACCESS_TO_DOCUMENT',
  UPDATE_APP_STORE_SUBSCRIPTION_PRODUCT = 'UPDATE_APP_STORE_SUBSCRIPTION_PRODUCT',
  UPDATE_APPLICATIONS = 'UPDATE_APPLICATIONS',
  UPDATE_CONFIGURATIONS = 'UPDATE_CONFIGURATIONS',
  UPDATE_DISPATCHERS = 'UPDATE_DISPATCHERS',
  UPDATE_DOCUMENT_COMMENTS = 'UPDATE_DOCUMENT_COMMENTS',
  UPDATE_DOCUMENTS = 'UPDATE_DOCUMENTS',
  UPDATE_FILE_SERVICE_SETTINGS = 'UPDATE_FILE_SERVICE_SETTINGS',
  UPDATE_FREE_STATUS = 'UPDATE_FREE_STATUS',
  UPDATE_GROUP = 'UPDATE_GROUP',
  UPDATE_GROUP_REPORT_CONFIGURATIONS = 'UPDATE_GROUP_REPORT_CONFIGURATIONS',
  UPDATE_GROUP_REQUESTS = 'UPDATE_GROUP_REQUESTS',
  UPDATE_GROUP_ROLE = 'UPDATE_GROUP_ROLE',
  UPDATE_LOCALIZATIONS = 'UPDATE_LOCALIZATIONS',
  UPDATE_NOTIFICATION_SETTINGS = 'UPDATE_NOTIFICATION_SETTINGS',
  UPDATE_OIDC_PROVIDER = 'UPDATE_OIDC_PROVIDER',
  UPDATE_PACKAGES = 'UPDATE_PACKAGES',
  UPDATE_PASSWORD_POLICY = 'UPDATE_PASSWORD_POLICY',
  UPDATE_PATIENT_CONFIGURATIONS = 'UPDATE_PATIENT_CONFIGURATIONS',
  UPDATE_PATIENT_REPORT_CONFIGURATIONS = 'UPDATE_PATIENT_REPORT_CONFIGURATIONS',
  UPDATE_PLAY_STORE_SUBSCRIPTION_PRODUCT = 'UPDATE_PLAY_STORE_SUBSCRIPTION_PRODUCT',
  UPDATE_PRESCRIPTION_STATUS = 'UPDATE_PRESCRIPTION_STATUS',
  UPDATE_PRESCRIPTIONS = 'UPDATE_PRESCRIPTIONS',
  UPDATE_PROFILE_IMAGE = 'UPDATE_PROFILE_IMAGE',
  UPDATE_PROFILES = 'UPDATE_PROFILES',
  UPDATE_REPORTS = 'UPDATE_REPORTS',
  UPDATE_ROLE = 'UPDATE_ROLE',
  UPDATE_SCHEMAS = 'UPDATE_SCHEMAS',
  UPDATE_STAFF_CONFIGURATIONS = 'UPDATE_STAFF_CONFIGURATIONS',
  UPDATE_STRIPE_ORDERS = 'UPDATE_STRIPE_ORDERS',
  UPDATE_STRIPE_PRODUCTS = 'UPDATE_STRIPE_PRODUCTS',
  UPDATE_STRIPE_USERS = 'UPDATE_STRIPE_USERS',
  UPDATE_TASK_FUNCTION = 'UPDATE_TASK_FUNCTION',
  UPDATE_TEMPLATES = 'UPDATE_TEMPLATES',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_USER_EMAIL = 'UPDATE_USER_EMAIL',
  UPDATE_USER_MFA_SETTINGS = 'UPDATE_USER_MFA_SETTINGS',
  UPDATE_USER_SERVICE_EMAIL_TEMPLATES = 'UPDATE_USER_SERVICE_EMAIL_TEMPLATES',
  UPDATE_USER_VERIFICATION_SETTINGS = 'UPDATE_USER_VERIFICATION_SETTINGS',
  VIEW_ACCESS_LOGS = 'VIEW_ACCESS_LOGS',
  VIEW_ACTIVATION_REQUESTS = 'VIEW_ACTIVATION_REQUESTS',
  VIEW_ACTIVE_PERIODS = 'VIEW_ACTIVE_PERIODS',
  VIEW_API_FUNCTION_REQUEST_LOGS = 'VIEW_API_FUNCTION_REQUEST_LOGS',
  VIEW_API_FUNCTION_REQUESTS = 'VIEW_API_FUNCTION_REQUESTS',
  VIEW_APP_STORE_NOTIFICATIONS = 'VIEW_APP_STORE_NOTIFICATIONS',
  VIEW_APP_STORE_RECEIPTS = 'VIEW_APP_STORE_RECEIPTS',
  VIEW_APP_STORE_SHARED_SECRETS = 'VIEW_APP_STORE_SHARED_SECRETS',
  VIEW_APP_STORE_SUBSCRIPTIONS = 'VIEW_APP_STORE_SUBSCRIPTIONS',
  VIEW_APPLICATIONS = 'VIEW_APPLICATIONS',
  VIEW_AUTHORIZATIONS = 'VIEW_AUTHORIZATIONS',
  VIEW_BALANCE = 'VIEW_BALANCE',
  VIEW_CONFIGURATIONS = 'VIEW_CONFIGURATIONS',
  VIEW_CREDIT_TRANSACTION = 'VIEW_CREDIT_TRANSACTION',
  VIEW_DISPATCHERS = 'VIEW_DISPATCHERS',
  VIEW_DOCUMENT_COMMENTS = 'VIEW_DOCUMENT_COMMENTS',
  VIEW_DOCUMENTS = 'VIEW_DOCUMENTS',
  VIEW_EVENTS = 'VIEW_EVENTS',
  VIEW_FILE_SERVICE_SETTINGS = 'VIEW_FILE_SERVICE_SETTINGS',
  VIEW_FILES = 'VIEW_FILES',
  VIEW_FORGOT_PASSWORD_REQUESTS = 'VIEW_FORGOT_PASSWORD_REQUESTS',
  VIEW_GROUP = 'VIEW_GROUP',
  VIEW_GROUP_REPORT_CONFIGURATIONS = 'VIEW_GROUP_REPORT_CONFIGURATIONS',
  VIEW_GROUP_REQUESTS = 'VIEW_GROUP_REQUESTS',
  VIEW_GROUPS = 'VIEW_GROUP',
  VIEW_MAILS = 'VIEW_MAILS',
  VIEW_NOTIFICATION_SETTINGS = 'VIEW_NOTIFICATION_SETTINGS',
  VIEW_NOTIFICATIONS = 'VIEW_NOTIFICATIONS',
  VIEW_OIDC_LOGIN_ATTEMPTS = 'VIEW_OIDC_LOGIN_ATTEMPTS',
  VIEW_OIDC_PROVIDERS = 'VIEW_OIDC_PROVIDERS',
  VIEW_PATIENT_CONFIGURATIONS = 'VIEW_PATIENT_CONFIGURATIONS',
  VIEW_PATIENT_REPORT_CONFIGURATIONS = 'VIEW_PATIENT_REPORT_CONFIGURATIONS',
  VIEW_PATIENTS = 'VIEW_PATIENTS',
  VIEW_PERIODS = 'VIEW_PERIODS',
  VIEW_PLAY_STORE_NOTIFICATIONS = 'VIEW_PLAY_STORE_NOTIFICATIONS',
  VIEW_PLAY_STORE_PURCHASE_INFOS = 'VIEW_PLAY_STORE_PURCHASE_INFOS',
  VIEW_PLAY_STORE_PURCHASE_RECEIPTS = 'VIEW_PLAY_STORE_PURCHASE_RECEIPTS',
  VIEW_PLAY_STORE_SUBSCRIPTIONS = 'VIEW_PLAY_STORE_SUBSCRIPTIONS',
  VIEW_PRESCRIPTIONS = 'VIEW_PRESCRIPTIONS',
  VIEW_PROFILE_LOG_ENTRIES = 'VIEW_PROFILE_LOG_ENTRIES',
  VIEW_REPORTS = 'VIEW_REPORTS',
  VIEW_ROLE = 'VIEW_ROLE',
  VIEW_STAFF = 'VIEW_STAFF',
  VIEW_STAFF_CONFIGURATIONS = 'VIEW_STAFF_CONFIGURATIONS',
  VIEW_STRIPE_ORDERS = 'VIEW_STRIPE_ORDERS',
  VIEW_STRIPE_USERS = 'VIEW_STRIPE_USERS',
  VIEW_SUBSCRIPTION_ENTITLEMENTS = 'VIEW_SUBSCRIPTION_ENTITLEMENTS',
  VIEW_SUBSCRIPTION_EVENTS = 'VIEW_SUBSCRIPTION_EVENTS',
  VIEW_SUBSCRIPTIONS = 'VIEW_SUBSCRIPTIONS',
  VIEW_TASK_FUNCTION_DETAILS = 'VIEW_TASK_FUNCTION_DETAILS',
  VIEW_TASK_FUNCTION_LOGS = 'VIEW_TASK_FUNCTION_LOGS',
  VIEW_TASK_FUNCTIONS = 'VIEW_TASK_FUNCTIONS',
  VIEW_TASK_LOGS = 'VIEW_TASK_LOGS',
  VIEW_TASK_SCHEDULES = 'VIEW_TASK_SCHEDULES',
  VIEW_TASKS = 'VIEW_TASKS',
  VIEW_TEMPLATES = 'VIEW_TEMPLATES',
  VIEW_USER = 'VIEW_USER',
  VIEW_USER_MFA_SETTINGS = 'VIEW_USER_MFA_SETTINGS',
  VIEW_USER_SERVICE_EMAIL_TEMPLATES = 'VIEW_USER_SERVICE_EMAIL_TEMPLATES',
  VIEW_USER_VERIFICATION_SETTINGS = 'VIEW_USER_VERIFICATION_SETTINGS',

  /** @deprecated Not in use any longer */
  DELETE_PRESCRIPTIONS = 'DELETE_PRESCRIPTIONS',
  /** @deprecated Not in use any longer */
  VIEW_MEASUREMENTS = 'VIEW_MEASUREMENTS',
  /** @deprecated Not in use any longer */
  UPDATE_MEASUREMENTS = 'UPDATE_MEASUREMENTS',
  /** @deprecated Not in use any longer */
  TRANSITION_MEASUREMENTS = 'TRANSITION_MEASUREMENTS',
  /** @deprecated Not in use any longer */
  DELETE_MEASUREMENTS = 'DELETE_MEASUREMENTS',
  /** @deprecated Not in use any longer */
  CREATE_MEASUREMENT_COMMENTS = 'CREATE_MEASUREMENT_COMMENTS',
  /** @deprecated Not in use any longer */
  VIEW_MEASUREMENT_COMMENTS = 'VIEW_MEASUREMENT_COMMENTS',
  /** @deprecated Not in use any longer */
  DELETE_PROFILES = 'DELETE_PROFILES',
  /** @deprecated Not in use any longer */
  UPDATE_GROUPS = 'UPDATE_GROUPS',
  /** @deprecated Not in use any longer */
  UPDATE_SENTIANCE_DATA = 'UPDATE_SENTIANCE_DATA',
  /** @deprecated Not in use any longer */
  CANCEL_TASKS_FUNCTIONS = 'CANCEL_TASKS_FUNCTIONS',
  /** @deprecated Not in use any longer */
  CREATE_TASKS_FUNCTIONS = 'CREATE_TASKS_FUNCTIONS',
  /** @deprecated Not in use any longer */
  DELETE_CONFIGURATIONS = 'DELETE_CONFIGURATIONS',
  /** @deprecated Not in use any longer */
  ADD_APPLICATION_VERSION = 'ADD_APPLICATION_VERSION',
  /** @deprecated Not in use any longer */
  VIEW_TASKS_FUNCTIONS = 'VIEW_TASKS_FUNCTIONS',
  /** @deprecated Not in use any longer */
  REMOVE_APPLICATION_VERSION = 'REMOVE_APPLICATION_VERSION',
  /** @deprecated Not in use any longer */
  MANAGE_SERVICE_ALERTS = 'MANAGE_SERVICE_ALERTS',
  /** @deprecated Not in use any longer */
  TRANSITION_DOCUMENTS = 'TRANSITION_DOCUMENTS',
  /** @deprecated Not in use any longer */
  VIEW_AWS_SES_STATISTICS = 'VIEW_AWS_SES_STATISTICS',
  /** @deprecated Not in use any longer */
  CREATE_USER_PERIODS = 'CREATE_USER_PERIODS',
  /** @deprecated Not in use any longer */
  VIEW_PLAY_STORE_PURCHASES = 'VIEW_PLAY_STORE_PURCHASES',
}

export interface GroupRolePermissions {
  permissions: string[];
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
  permissions: string[];
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

export interface EmailTemplates {
  /** Template id used by the User Service for the account activation email. */
  activationEmailTemplateId: string;

  /** Template id used by the User Service for the account reactivation email. */
  reactivationEmailTemplateId: string;

  /** Template id used by the User Service for the password reset email. */
  passwordResetEmailTemplateId: string;

  /** Template id used by the User Service for the OIDC unlink email. */
  oidcUnlinkEmailTemplateId: string;

  /** Template id used by the User Service for the OIDC unlink pin code email. */
  oidcUnlinkPinEmailTemplateId: string;

  /** Template id used by the User Service for the account activation pin code email. */
  activationPinEmailTemplateId: string;

  /** Template id used by the User Service for the account reactivation pin code email. */
  reactivationPinEmailTemplateId: string;

  /** Template id used by the User Service for the password reset pin code email. */
  passwordResetPinEmailTemplateId: string;
}

export interface PasswordResetRequestData {
  email: string;

  /** The verification mode to use. Defaults to `hash`. */
  mode?: 'hash' | 'pin_code';
}

export interface ActivationRequestData {
  email: string;

  /** The verification mode to use. Defaults to `hash`. */
  mode?: 'hash' | 'pin_code';
}

export interface UsersGlobalRolesService {
  /**
   * Retrieve a list of permissions
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @returns PagedResult<GlobalPermission>
   */
  getPermissions(options?: OptionsBase): Promise<PagedResult<GlobalPermission>>;

  /**
   * Retrieve a list of roles
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Role>>;

  /**
   * Returns the first role found
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   */
  findFirst(options?: OptionsWithRql): Promise<Role>;

  /**
   * Returns the first role with a specific id
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Role>;

  /**
   * Returns the first role with a specific name
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   */
  findByName(name: string, options?: OptionsWithRql): Promise<Role>;

  /**
   * @deprecated Use `find` instead
   *
   * Retrieve a list of roles
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_ROLE` | `global` | **Required** for this endpoint
   * @returns PagedResult<Role>
   */
  get(options?: OptionsWithRql): Promise<PagedResult<Role>>;

  /**
   * Create a role
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_ROLE` | `global` | **Required** for this endpoint
   * @param requestBody The role data
   * @returns Role
   */
  create(requestBody: RoleCreation, options?: OptionsBase): Promise<Role>;
  /**
   * Delete a role
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_ROLE` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(rql: RQLString, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Update a role
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ROLE` | `global` | **Required** for this endpoint
   * @param id Id of the targeted role
   * @param requestBody RoleUpdate
   * @returns Promise<Role>
   */
  update(
    id: ObjectId,
    requestBody: RoleUpdate,
    options?: OptionsBase
  ): Promise<Role>;
  /**
   * Add permissions to a role
   *
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_ROLE_PERMISSION` | `global` | **Required** for this endpoint
   * @param requestBody RolePermissions
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  addPermissions(
    rql: RQLString,
    requestBody: RolePermissions,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove permissions from roles
   *
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_ROLE_PERMISSION` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @param requestBody RolePermissions
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  removePermissions(
    rql: RQLString,
    requestBody: RolePermissions,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Add roles to users
   *
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_ROLE_TO_USER` | `global` | **Required** for this endpoint
   * @param requestBody UserRoles
   * @returns AffectedRecords
   */
  addToUsers(
    rql: RQLString,
    requestBody: UserRoles,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove roles from users
   *
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_ROLE_FROM_USER` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @param requestBody UserRoles
   * @returns AffectedRecords
   */
  removeFromUser(
    rql: RQLString,
    requestBody: UserRoles,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface UsersGroupRolesService {
  /**
   * Retrieve a list of group permissions
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @returns PagedResult<GlobalPermission>
   */
  getPermissions(options?: OptionsBase): Promise<PagedResult<GlobalPermission>>;

  /**
   * Retrieve a list of group roles
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the roles for the group
   * `VIEW_GROUP` | `global` | View any group its roles
   */
  find(
    groupId: ObjectId,
    options?: OptionsWithRql
  ): Promise<PagedResult<GroupRole>>;

  /**
   * Returns the first group role found
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the roles for the group
   * `VIEW_GROUP` | `global` | View any group its roles
   */
  findFirst(
    groupId: ObjectId,
    options?: OptionsWithRql
  ): Promise<GroupRole>;

  /**
   * Finds a group role by its id
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the roles for the group
   * `VIEW_GROUP` | `global` | View any group its roles
   */
  findById(
    groupId: ObjectId,
    roleId: ObjectId,
    options?: OptionsWithRql
  ): Promise<GroupRole>;

  /**
   * Returns the first group role found by a specific name
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the roles for the group
   * `VIEW_GROUP` | `global` | View any group its roles
   */
  findByName(
    groupId: ObjectId,
    roleName: string,
    options?: OptionsWithRql
  ): Promise<GroupRole>;

  /**
   * @deprecated Use `find` instead
   *
   * Retrieve a list of group roles
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the roles for the group
   * `VIEW_GROUP` | `global` | View any group its roles
   * @param groupId Id of the targeted group
   * @returns PagedResult<GroupRole>
   */
  get(
    groupId: ObjectId,
    options?: OptionsWithRql
  ): Promise<PagedResult<GroupRole>>;

  /**
   * Add role to a group
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_GROUP_ROLE` | `staff enlistment` | Create a role for any group
   * `CREATE_GROUP_ROLE` | `global` | Create a role for the group
   * @param groupId Id of the targeted group
   * @param requestBody The role to add
   * @returns GroupRole
   */
  add(
    groupId: ObjectId,
    requestBody: AddRole,
    options?: OptionsBase
  ): Promise<GroupRole>;
  /**
   * Update a group role
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_GROUP_ROLE` | `staff enlistment` | Update a role for the group
   * `UPDATE_GROUP_ROLE` | `global` | Update a role for any group
   * @param groupId Id of the targeted group
   * @param roleId Id of the targeted role
   * @param requestBody The role data to update
   * @returns GroupRole
   * @throws {ResourceUnknownError}
   */
  update(
    groupId: ObjectId,
    roleId: ObjectId,
    requestBody: AddRole,
    options?: OptionsBase
  ): Promise<GroupRole>;
  /**
   * Remove a role from a group
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_GROUP_ROLE` | `staff enlistment` | Delete a role for the group
   * `DELETE_GROUP_ROLE` | `global` | Delete a role from any group
   * @param rql Add filters to the requested list.
   * @param groupId Id of the targeted group
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(
    rql: RQLString,
    groupId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Add permissions to group roles
   *
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_GROUP_ROLE_PERMISSION` | `staff enlistment` | Add permissions to roles of the group
   * `ADD_GROUP_ROLE_PERMISSION` | `global` | Add permissions to roles of any group
   * @param groupId Id of the targeted group
   * @param requestBody GroupRolePermissions
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  addPermissions(
    groupId: ObjectId,
    requestBody: GroupRolePermissions,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  /**
   * Remove permissions from group roles
   *
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_GROUP_ROLE_PERMISSION` | `staff enlistment` | Remove permissions from roles of the group
   * `REMOVE_GROUP_ROLE_PERMISSION` | `global` | Remove permissions from roles of any group
   * @param rql Add filters to the requested list.
   * @param groupId Id of the targeted group
   * @param requestBody GroupRolePermissions
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  removePermissions(
    rql: RQLString,
    groupId: ObjectId,
    requestBody: GroupRolePermissions,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Assign roles to staff members of a group
   *
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_GROUP_ROLE_TO_STAFF` | `staff enlistment` | Assign roles for the group
   * `ADD_GROUP_ROLE_TO_STAFF` | `global` | Assign roles for any group
   * @param groupId Id of the targeted group
   * @param requestBody StaffRoles
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  assignToStaff(
    groupId: ObjectId,
    requestBody: StaffRoles,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  /**
   * Remove roles from staff members of a group
   *
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_GROUP_ROLE_FROM_STAFF` | `staff enlistment` | Remove roles from staff of the group
   * `REMOVE_GROUP_ROLE_FROM_STAFF` | `global` | Remove roles from staff of any group
   * @param rql Add filters to the requested list.
   * @param groupId Id of the targeted group
   * @param requestBody StaffRoles
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  removeFromStaff(
    rql: RQLString,
    groupId: ObjectId,
    requestBody: StaffRoles,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Add users to staff
   *
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_STAFF` | `staff enlistment` | Add staff to the group
   * `ADD_STAFF` | `global` | Add staff to any group
   * @param requestBody StaffGroups
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  addUsersToStaff(
    requestBody: StaffGroups,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;

  /**
   * Remove users from staff
   *
   * Permission | Scope | Effect
   * - | - | -
   * `REMOVE_STAFF` | `staff enlistment` | Remove staff from the group
   * `REMOVE_STAFF` | `global` | Remove staff from any group
   * @param rql Add filters to the requested list.
   * @param requestBody StaffGroups
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  removeUsersFromStaff(
    rql: RQLString,
    requestBody: StaffGroups,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface UsersService {
  /**
   * Retrieve the current logged in user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns {UserData} UserData
   */
  me(options?: OptionsBase): Promise<User>;
  /**
   * Retrieve a specific user
   * @params {string} userId of the targeted user (required)
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See your own user object
   * none | group  | See a subset of the fields for any staff member or patient of the group
   * VIEW_PATIENTS | global | See a subset of fields for any user with a patient enlistment
   * VIEW_STAFF | global | See a subset of fields for any user with a staff enlistment
   * VIEW_USER | global | See any user object
   * @throws {ResourceUnknownError}
   * @returns {UserData} UserData
   */
  findById(userId: string, options?: OptionsBase): Promise<User>;
  /**
   * Update a specific user
   * @params {string} userId of the targeted user (required)
   * @params {Pick<UserData,'firstName' | 'lastName' | 'phoneNumber' | 'language' | 'timeZone'>} data Fields to update
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own data
   * `UPDATE_USER` | global | Update any user
   * @throws {ResourceUnknownError}
   * @returns {UserData} UserData
   */
  update(
    userId: string,
    userData: UserDataUpdate,
    options?: OptionsBase
  ): Promise<UserData>;
  /**
   * Retrieve a list of users
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See a limited set of fields of the staff members (of the groups where you are enlisted as a patient)
   * none | `staff enlistment` | See a limited set of fields of all patients and staff members (of the groups where you are enlisted as staff member)
   * `VIEW_USER` | `global` | See all fields of all users
   * @returns PagedResultWithPager<User>
   */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<User>>;
  /**
   * Request a list of all users
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See a limited set of fields of the staff members (of the groups where you are enlisted as a patient)
   * none | `staff enlistment` | See a limited set of fields of all patients and staff members (of the groups where you are enlisted as staff member)
   * `VIEW_USER` | `global` | See all fields of all users
   * @returns User[]
   */
  findAll(options?: OptionsWithRql): Promise<User[]>;
  /**
   * Request a list of all users
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See a limited set of fields of the staff members (of the groups where you are enlisted as a patient)
   * none | `staff enlistment` | See a limited set of fields of all patients and staff members (of the groups where you are enlisted as staff member)
   * `VIEW_USER` | `global` | See all fields of all users
   * @returns User[]
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<User>;
  findFirst(options?: { rql?: RQLString; }): Promise<User>;
  /**
   * @deprecated
   * Delete a list of users
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete your own user (object)
   * `DELETE_USER` | `global` | Delete any user
   * @param rql Add filters to the requested list.
   * @returns AffectedRecords
   */
  removeUsers(rql: RQLString, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Retrieve a list of users that have a patient enlistment
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the patients of the group
   * `VIEW_PATIENTS` | `global`  | View all patients
   * @returns Patient Success
   */
  patients(options?: OptionsWithRql): Promise<PagedResult<Patient>>;
  /**
   * Retrieve a list of users that have a staff enlistment
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `staff enlistment` | View the other staff members of the group
   * `VIEW_STAFF` | `global`  | View all staff members
   * @returns StaffMember Success
   */
  staff(options?: OptionsWithRql): Promise<PagedResult<StaffMember>>;
  /**
   * Delete a specific user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete your own user object
   * `DELETE_USER` | `global` | Delete any user
   * @param userId Id of the targeted user
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(userId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * Update the email address of a specific user.
   *
   * An email is send to the new email address with a token and instructions to reactivate the account.
   * The token should be used to complete the account activation via `exh.users.validateEmailActivation`.
   *
   * By default the email send to the user is the email template configured by `reactivationEmailTemplateId`.
   * The template receives a 40 hexadecimal character hash in the `content.activation_hash` variable.
   * The hash should be used within 60 minutes, otherwise `exh.users.requestEmailActivation` should be used to request a new email.
   *
   * If enabled, a pin code can be used rather than a hash.
   * The pin code mode must be enabled by the `enablePinCodeActivationRequests` verification setting.
   * To use the pin code mode, the `activationMode` field can be set to `pin_code`.
   * Then the email send to the user is the email template configured by `reactivationPinEmailTemplateId`.
   * The pin code template receives a 8 digit pin code in the `content.pin_code` variable.
   * The pin code should be used within 15 minutes, otherwise `exh.users.requestEmailActivation` should be used to request a new email.
   *
   * If a custom (or no) account activation flow is desired, the `activationMode` field can be set to `manual`.
   * No email will be send.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own data
   * `UPDATE_USER_EMAIL` | `global` | Update any user
   *
   * @throws {EmailUsedError}
   * @throws {ResourceUnknownError}
   * @throws {PinCodesNotEnabledError} Pin codes are not enabled, please check the verification settings
   */
  updateEmail(
    userId: ObjectId,
    requestBody: EmailUpdate,
    options?: OptionsBase
  ): Promise<User>;

  /**
   * Add a patient enlistment to a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * `ADD_PATIENT` | `global` | **Required** for this endpoint
   * @param userId Id of the targeted user
   * @param requestBody AddPatientEnlistment
   * @returns AffectedRecords
   * @throws {ResourceAlreadyExistsError}
   */
  addPatientEnlistment(
    userId: ObjectId,
    requestBody: AddPatientEnlistment,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove a patient enlistment from a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Remove a patient enlistment from yourself
   * `REMOVE_PATIENT` | `staff enlistment` | Remove a patient enlistment for the group
   * `REMOVE_PATIENT` | `global` | Remove any patient enlistment
   * @param userId Id of the targeted user
   * @param groupId Id of the targeted group
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  removePatientEnlistment(
    userId: ObjectId,
    groupId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * Create an account.
   *
   * An email is send to the supplied email address with a token and instructions to activate the account.
   * The token should be used to complete the account activation via `exh.users.validateEmailActivation`.
   *
   * By default the email send to the user is the email template configured by `activationEmailTemplateId`.
   * The template receives a 40 hexadecimal character hash in the `content.activation_hash` variable.
   * The hash should be used within 60 minutes, otherwise `exh.users.requestEmailActivation` should be used to request a new email.
   *
   * If enabled, a pin code can be used rather than a hash.
   * The pin code mode must be enabled by the `enablePinCodeActivationRequests` verification setting.
   * To use the pin code mode, the `activationMode` field can be set to `pin_code`.
   * Then the email send to the user is the email template configured by `activationPinEmailTemplateId`.
   * The pin code template receives a 8 digit pin code in the `content.pin_code` variable.
   * The pin code should be used within 15 minutes, otherwise `exh.users.requestEmailActivation` should be used to request a new email.
   *
   * If a custom (or no) account activation flow is desired, the `activationMode` field can be set to `manual`.
   * No email will be send.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @throws {EmailUsedError}
   * @throws {PinCodesNotEnabledError} Pin codes are not enabled, please check the verification settings
   */
  createAccount(
    requestBody: RegisterUserData,
    options?: OptionsBase
  ): Promise<User>;

  /**
   * Change your password
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param requestBody ChangePassword
   * @returns User
   * @throws {PasswordError}
   */
  changePassword(
    requestBody: ChangePassword,
    options?: OptionsBase
  ): Promise<boolean>;

  /**
   * Authenticate a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param requestBody Authenticate
   * @returns User
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   */
  authenticate(requestBody: Authenticate, options?: OptionsBase): Promise<User>;

  /**
   * Request an email activation.
   *
   * An email is send to the supplied email address with a token and instructions to activate the account.
   * The token should be used to complete the account activation via `exh.users.validateEmailActivation`.
   *
   * The email send to the user is the email template configured by `activationEmailTemplateId`.
   * The template receives a 40 hexadecimal character hash in the `content.activation_hash` variable.
   * The hash should be used within 60 minutes, otherwise this method should be called again to request a new email.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @throws {EmailUnknownError}
   * @throws {AlreadyActivatedError}
   * @throws {IllegalStateError} Attempting to use `activationEmailTemplateId` while not configured. See `exh.users.setEmailTemplates`.
   * @throws {ActivationRequestLimitError} The maximum allowed consecutive activation requests is reached
   * @throws {ActivationRequestTimeoutError} Activation request too short after the previous one
   */
  requestEmailActivation(
    email: string,
    options?: OptionsBase
  ): Promise<boolean>;

  /**
   * Request an email activation.
   *
   * An email is send to the supplied email address with a token and instructions to activate the account.
   * The token should be used to complete the account activation via `exh.users.validateEmailActivation`.
   *
   * By default the email send to the user is the email template configured by `activationEmailTemplateId`.
   * The template receives a 40 hexadecimal character hash in the `content.activation_hash` variable.
   * The hash should be used within 60 minutes, otherwise this method should be called again to request a new email.
   *
   * If enabled, a pin code can be used rather than a hash.
   * The pin code mode must be enabled by the `enablePinCodeActivationRequests` verification setting.
   * To use the pin code mode, the `activationMode` field can be set to `pin_code`.
   * Then the email send to the user is the email template configured by `activationPinEmailTemplateId`.
   * The pin code template receives a 8 digit pin code in the `content.pin_code` variable.
   * The pin code should be used within 15 minutes, otherwise this method should be called again to request a new email.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @throws {EmailUnknownError}
   * @throws {AlreadyActivatedError}
   * @throws {IllegalStateError} Attempting to use either `activationEmailTemplateId` or `activationPinEmailTemplateId` while not configured. See `exh.users.setEmailTemplates`.
   * @throws {ActivationRequestLimitError} The maximum allowed consecutive activation requests is reached
   * @throws {ActivationRequestTimeoutError} Activation request too short after the previous one
   */
  requestEmailActivation(
    data: ActivationRequestData,
    options?: OptionsBase
  ): Promise<boolean>;

  /**
   * Complete an email activation.
   *
   * Either a hash activation with just the `hash` field.
   * Or a pin code activation with the `email` and `pinCode` fields.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @throws {ActivationUnknownError}
   * @throws {TooManyFailedAttemptsError} Attempts are blocked due to too many failed attempts, a new activation request needs to be generated before new attempts can be made
   * @throws {IncorrectPinCodeError} The provided pin code was incorrect
   */
  validateEmailActivation(
    requestBody: ActivationCompletion,
    options?: OptionsBase
  ): Promise<boolean>;

  /**
   * Request a password reset.
   *
   * An email is send to the targeted user with a token and instructions to reset their password.
   * The token should be used to complete the password reset via `exh.users.validatePasswordReset`.
   *
   * The email send to the user is the email template configured by `passwordResetEmailTemplateId`.
   * The template receives a 40 hexadecimal character hash in the `content.reset_hash` variable.
   * The hash should be used within 60 minutes, otherwise this method should be called again to request a new email.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @throws {EmailUnknownError}
   * @throws {NotActivatedError}
   * @throws {IllegalStateError} Attempting to use either `passwordResetEmailTemplateId` or `passwordResetPinEmailTemplateId` while not configured. See `exh.users.setEmailTemplates`.
   * @throws {ForgotPasswordRequestLimitError} The maximum allowed consecutive forgot password requests is reached
   * @throws {ForgotPasswordRequestTimeoutError} Forgot password request too short after the previous one
   */
  requestPasswordReset(email: string, options?: OptionsBase): Promise<boolean>;

  /**
   * Request a password reset.
   *
   * An email is send to the targeted user with a token and instructions to reset their password.
   * The token should be used to complete the password reset via `exh.users.validatePasswordReset`.
   *
   * By default the email send to the user is the email template configured by `passwordResetEmailTemplateId`.
   * The template receives a 40 hexadecimal character hash in the `content.reset_hash` variable.
   * The hash should be used within 60 minutes, otherwise this method should be called again to request a new email.
   *
   * If enabled, a pin code can be used rather than a hash.
   * The pin code mode must be enabled by the `enablePinCodeForgotPasswordRequests` verification setting.
   * To use the pin code mode, the `mode` field can be set to `pin_code`.
   * Then the email send to the user is the email template configured by `passwordResetPinEmailTemplateId`.
   * The pin code template receives a 8 digit pin code in the `content.pin_code` variable.
   * The pin code should be used within 15 minutes, otherwise this method should be called again to request a new email.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @throws {EmailUnknownError}
   * @throws {NotActivatedError}
   * @throws {IllegalStateError} Attempting to use either `passwordResetEmailTemplateId` or `passwordResetPinEmailTemplateId` while not configured. See `exh.users.setEmailTemplates`.
   * @throws {DisabledForOidcUsersError}
   * @throws {PinCodesNotEnabledError} Pin codes are not enabled, please check the verification settings
   * @throws {ForgotPasswordRequestLimitError} The maximum allowed consecutive forgot password requests is reached
   * @throws {ForgotPasswordRequestTimeoutError} Forgot password request too short after the previous one
   */
  requestPasswordReset(data: PasswordResetRequestData, options?: OptionsBase): Promise<boolean>;

  /**
   * Complete a password reset.
   *
   * Either a hash password reset with the `hash` and `newPassword` fields.
   * Or a pin code password reset with the `email`, `pinCode` and `newPassword` fields.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @throws {NotActivatedError}
   * @throws {NewPasswordHashUnknownError} The provided hash either does not exist or is expired
   * @throws {NewPasswordPinCodeUnknownError} No password reset request was found or it is expired for the provided email
   * @throws {TooManyFailedAttemptsError} Attempts are blocked due to too many failed attempts, a new password reset request needs to be generated before new attempts can be made
   * @throws {IncorrectPinCodeError} The provided pin code was incorrect
   * @throws {DisabledForOidcUsersError}
   */
  validatePasswordReset(
    requestBody: PasswordResetCompletion,
    options?: OptionsBase
  ): Promise<boolean>;

  /**
   * Confirm the password for the user making the request
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param requestBody the password to confirm
   * @returns {boolean} true if password was confirmed
   * @throws {AuthenticationError}
   * @throws {LoginTimeoutError}
   * @throws {LoginFreezeError}
   * @throws {TooManyFailedAttemptsError}
   */
  confirmPassword(
    requestBody: ConfirmPassword,
    options?: OptionsBase
  ): Promise<boolean>;
  /**
   * Check if an email address is still available
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param email
   * @returns emailAvailable will be true on success
   */
  isEmailAvailable(
    email: string,
    options?: OptionsBase
  ): Promise<{
    emailAvailable: boolean;
  }>;
  /**
   * Update the profile image of a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own profile image
   * `UPDATE_PROFILE_IMAGE` | `global` | Update any user its profile image
   * @deprecated this method is deprecated in swagger
   * @param userId Id of the targeted user
   * @param requestBody Hash
   * @returns User
   * @throws {ResourceUnknownError}
   */
  updateProfileImage(
    userId: ObjectId,
    requestBody: Hash,
    options?: OptionsBase
  ): Promise<User>;
  /**
   * Delete the profile image of a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete your own profile image
   * `UPDATE_PROFILE_IMAGE` | `global` | Delete any user its profile image
   * @param userId Id of the targeted user
   * @returns User
   * @throws {ResourceUnknownError}
   */
  deleteProfileImage(userId: ObjectId, options?: OptionsBase): Promise<User>;
  /**
   * Retrieve the current pasword policy
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns {PasswordPolicy} PasswordPolicy
   */
  passwordPolicy(options?: OptionsBase): Promise<PasswordPolicy>;
  /**
   * Update the current pasword policy
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PASSWORD_POLICY` | `global` | Update password policy
   * @returns {PasswordPolicy} PasswordPolicy
   */
  updatePasswordPolicy(
    requestBody: PasswordPolicy,
    options?: OptionsBase
  ): Promise<PasswordPolicy>;

  /**
   * ## Retrieve a list of email templates
   *
   * **Global Permissions:**
   * - `VIEW_USER_SERVICE_EMAIL_TEMPLATES` - Allows a user to view the email templates configuration
   *
   * **Notes:**
   * - If an email template has not been set, it will not appear in the response
   * @param options {@link OptionsBase} - Add options to the request
   * @returns A list of email templates {@link EmailTemplates}
   */
  getEmailTemplates(options?: OptionsBase): Promise<EmailTemplates>;

  /**
   * ## Set the list of email templates
   *
   * **Global Permissions:**
   * - `UPDATE_USER_SERVICE_EMAIL_TEMPLATES` - Allows a user to update the email templates configuration
   *
   * **Notes:**
   * - This operation works as an update and will only update the templates that are provided
   * @param templates {@link EmailTemplatesUpdate} - A partial list of email templates to update
   * @returns A list of email templates {@link EmailTemplates}
   */
  setEmailTemplates(
    templates: Partial<EmailTemplates>
  ): Promise<EmailTemplates>;
}
