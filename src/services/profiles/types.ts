import { Object } from 'ts-toolbelt';
import { RQLString } from '../../rql';
import {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';

export interface Profile {
  id?: ObjectId;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  region?: string;
  city?: string;
  postalCode?: string;
  birthday?: string;
  /**
   * See ISO 5218
   */
  gender?: number;
  length?: number;
  weight?: number;
  afHistory?: boolean;
  comorbidities?: Array<Comorbidities>;
  physician?: string;
  smoker?: boolean;
  activity?: ProfileActivity;
  impediments?: Array<Impediments>;
  medication?: Array<Medication>;
  groups?: Array<Group>;
  customFields?: Record<string, string>;
  fibricheckInfo?: string;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export type ProfileCreation = Object.Required<
  Pick<Profile, 'id' | 'country' | 'region' | 'birthday' | 'gender'>,
  'id' | 'country' | 'birthday' | 'gender'
>;

export enum ProfileActivity {
  NOT_ACTIVE = 'NOT_ACTIVE',
  SLIGHTLY_ACTIVE = 'SLIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  ACTIVE = 'ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
}

export enum Comorbidities {
  HEART_FAILURE = 'HEART_FAILURE',
  DIABETES = 'DIABETES',
  COPD = 'COPD',
  HYPERTENSION = 'HYPERTENSION',
  VASCULAR_DISEASE = 'VASCULAR_DISEASE',
  HISTORY_OF_TIA_STROKE = 'HISTORY_OF_TIA_STROKE',
}

export enum Impediments {
  TREMOR = 'TREMOR',
  PERNIOSIS = 'PERNIOSIS',
  CALLUS = 'CALLUS',
}

export interface Medication {
  name: string;
  dosis: {
    number?: number;
    unit?: MedicationUnit;
  };
  medicationFrequency?: MedicationFrequency;
  count: number;
}

export enum MedicationUnit {
  MG = 'mg',
  ML = 'ml',
  PILL = 'pill',
}

export enum MedicationFrequency {
  AS_NEEDED = 'AS_NEEDED',
  EVERY_DAY = 'EVERY_DAY',
  EVERY_WEEK = 'EVERY_WEEK',
  EVERY_MONTH = 'EVERY_MONTH',
  BIRTH_CONTROL = 'BIRTH_CONTROL',
}

export interface Group {
  groupId?: ObjectId;
  reason?: string;
  /**
   * This serves as a field to link a patient to the medical record of a hospital/physician. This field therefor accepts any string, not just an ObjectId.
   *
   */
  patientId?: string;
  customFields?: Record<string, string>;
}

export type GroupCreation = Object.Required<Group, 'groupId'>;

export interface LogEntry {
  id?: ObjectId;
  profileId?: ObjectId;
  groupId?: ObjectId;
  userId?: ObjectId;
  text?: string;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface ProfileComment {
  text: string;
}

export interface ProfilesGroupsService {
  /**
   * Add a group enlistment to a profile
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Add a group enlistment for your profile only
   * `ADD_PATIENT` | `staff enlistment` | Add a group enlistment for any profile of this group
   * `ADD_PATIENT` & `ACTIVATE_PRESCRIPTIONS` | `global` | Add a group enlistment for any profile for any group
   * @param profileId Id of the targeted profile
   * @param requestBody Group data
   * @returns Group
   * @throws {ResourceAlreadyExistsError}
   * @throws {ResourceUnknownError}
   */
  create(
    profileId: ObjectId,
    requestBody: GroupCreation,
    options?: OptionsBase
  ): Promise<Group>;
  /**
   * Update a group enlistment on a profile
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PROFILES` | `staff enlistment` | Update a group enlistment for any profile for this group
   * `UPDATE_PROFILES` | `global` | Update a group enlistment for any profile for any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param requestBody Group data to update
   * @returns Group
   * @throws {ResourceUnknownError}
   */
  update(
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: Omit<Group, 'groupId'>,
    options?: OptionsBase
  ): Promise<Group>;
  /**
   * Delete a group from a profile
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete a group from your profile only
   * `UPDATE_PROFILES` | `staff enlistment` | Delete a group from any profile in this group
   * `UPDATE_PROFILES` | `global` | Delete a group from any profile in any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(
    profileId: ObjectId,
    groupId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove a field on a group enlistment object in a profile
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_PROFILES` | `staff enlistment` | Remove a field for this group
   * `UPDATE_PROFILES` | `global` | Remove a field for any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param requestBody list of fields to remove
   * @returns Group
   * @throws {ResourceUnknownError}
   */
  removeFields(
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsBase
  ): Promise<Group>;
}

export interface ProfilesLogsService {
  /**
   * Create a profile log entry
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_PROFILE_LOG_ENTRIES` | `staff enlistment` | Create a log entry for any profile of this group
   * `CREATE_PROFILE_LOG_ENTRIES` | `global` | Create a log entry for any profile of any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param requestBody ProfileComment
   * @returns LogEntry
   * @throws {ResourceUnknownError}
   */
  create(
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: ProfileComment,
    options?: OptionsBase
  ): Promise<LogEntry>;
  /**
   * Retrieve all profile log entries
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_PROFILE_LOG_ENTRIES` | `staff enlistment` | Retrieve a list of log entries for any profile of this group
   * `VIEW_PROFILE_LOG_ENTRIES` | `global` | Retrieve a list of log entries for any profile of any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @returns PagedResult<LogEntry>
   * @throws {ResourceUnknownError}
   */
  find(
    profileId: ObjectId,
    groupId: ObjectId,
    options?: OptionsWithRql
  ): Promise<PagedResult<LogEntry>>;
  /**
   * Request a list of all profile log entries
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_PROFILE_LOG_ENTRIES` | `staff enlistment` | Retrieve a list of log entries for any profile of this group
   * `VIEW_PROFILE_LOG_ENTRIES` | `global` | Retrieve a list of log entries for any profile of any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @returns LogEntry[]
   */
  findAll(
    profileId: ObjectId,
    groupId: ObjectId,
    options?: OptionsWithRql
  ): Promise<LogEntry[]>;
  /**
   * Request a list of all profile log entries
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_PROFILE_LOG_ENTRIES` | `staff enlistment` | Retrieve a list of log entries for any profile of this group
   * `VIEW_PROFILE_LOG_ENTRIES` | `global` | Retrieve a list of log entries for any profile of any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param rql Add filters to the requested list.
   * @returns LogEntry[]
   */
  findAllIterator(
    profileId: ObjectId,
    groupId: ObjectId,
    options?: OptionsWithRql
  ): AsyncGenerator<PagedResult<LogEntry>, Record<string, never>, void>;
  /**
   * Update a profile log entry
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_PROFILE_LOG_ENTRIES` | `staff enlistment` | Update a log entry, created by the current user, for any profile of this group
   * `CREATE_PROFILE_LOG_ENTRIES` | `global` | Update a log entry, created by the current user, for any profile of any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param entryId Id of the targeted log entry
   * @param requestBody ProfileComment
   * @returns LogEntry
   * @throws {ResourceUnknownError}
   */
  update(
    profileId: ObjectId,
    groupId: ObjectId,
    entryId: ObjectId,
    requestBody: ProfileComment,
    options?: OptionsBase
  ): Promise<LogEntry>;
  /**
   * Delete a profile log entry
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_PROFILE_LOG_ENTRIES` | `staff enlistment` | Delete a log entry, created by the current user, for any profile of this group
   * `CREATE_PROFILE_LOG_ENTRIES` | `global` | Delete a log entry, created by the current user, for any profile of any group
   * @param profileId Id of the targeted profile
   * @param groupId Id of the targeted group
   * @param entryId Id of the targeted log entry
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(
    profileId: ObjectId,
    groupId: ObjectId,
    entryId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface ProfilesService {
  /**
   * Get a list of profiles
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your profile
   * none | `staff enlistment` | View all the profiles of the group
   * `VIEW_PATIENTS` | `global` | View all profiles
   * @param rql an optional rql string
   * @returns PagedResult<Profile>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Profile>>;
  /**
   * Request a list of all profiles
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your profile
   * none | `staff enlistment` | View all the profiles of the group
   * `VIEW_PATIENTS` | `global` | View all profiles
   * @param rql Add filters to the requested list.
   * @returns Profile[]
   */
  findAll(options?: OptionsWithRql): Promise<Profile[]>;
  /**
   * Request a list of all profiles
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View your profile
   * none | `staff enlistment` | View all the profiles of the group
   * `VIEW_PATIENTS` | `global` | View all profiles
   * @param rql Add filters to the requested list.
   * @returns Profile[]
   */
  findAllIterator(
    options?: OptionsWithRql
  ): AsyncGenerator<PagedResult<Profile>, Record<string, never>, void>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Profile>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Profile>;
  /**
   * Create a new profile
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Create a profile for the current user
   * `CREATE_PROFILES` | `global` | Create a profile for any user
   * @param requestBody ProfileCreation
   * @returns Profile
   * @throws {ProfileAlreadyExistsError}
   */
  create(requestBody: ProfileCreation, options?: OptionsBase): Promise<Profile>;
  /**
   * Update an existing profile
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your profile
   * `UPDATE_PROFILES` | `staff enlistment` | Update the profile of any group member
   * `UPDATE_PROFILES` | `global` | Update any profile
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody The Profile data to update
   * @returns AffectedRecords
   */
  update(
    rql: RQLString,
    requestBody: Profile,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove a given field from all profile records
   *
   * To make a selection of profiles, use RQL.
   * Permission | Scope | Effect
   * - | - | -
   * none | | Remove a given field from your profile
   * `UPDATE_PROFILES` | `staff enlistment` | Remove a given field from any group member
   * `UPDATE_PROFILES` | `global` | Remove a given field from any profile
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody the list of fields to remove
   * @returns AffectedRecords
   * @throws {RemoveFieldError}
   */
  removeFields(
    rql: RQLString,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Retrieve a list of all the defined comorbidities
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns PagedResult<Comorbidities>
   */
  getComorbidities(options?: OptionsBase): Promise<PagedResult<Comorbidities>>;
  /**
   * Retrieve a list of all the defined impediments
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns PagedResult<Impediments>
   */
  getImpediments(options?: OptionsBase): Promise<PagedResult<Impediments>>;
}
