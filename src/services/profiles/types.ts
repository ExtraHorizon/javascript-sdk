import { Object } from 'ts-toolbelt';
import { RQLString } from '../../rql';
import {
  AffectedRecords,
  ObjectId,
  PagedResult,
  PagedResultWithPager,
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
  create(
    this: ProfilesGroupsService,
    profileId: ObjectId,
    requestBody: GroupCreation
  ): Promise<Group>;
  update(
    this: ProfilesGroupsService,
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: Omit<Group, 'groupId'>
  ): Promise<Group>;
  remove(
    this: ProfilesGroupsService,
    profileId: ObjectId,
    groupId: ObjectId
  ): Promise<AffectedRecords>;
  removeFields(
    this: ProfilesGroupsService,
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<Group>;
}

export interface ProfilesLogsService {
  create(
    this: ProfilesLogsService,
    profileId: ObjectId,
    groupId: ObjectId,
    requestBody: ProfileComment
  ): Promise<LogEntry>;
  find(
    this: ProfilesLogsService,
    profileId: ObjectId,
    groupId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<PagedResultWithPager<LogEntry>>;
  update(
    this: ProfilesLogsService,
    profileId: ObjectId,
    groupId: ObjectId,
    entryId: ObjectId,
    requestBody: ProfileComment
  ): Promise<LogEntry>;
  remove(
    this: ProfilesLogsService,
    profileId: ObjectId,
    groupId: ObjectId,
    entryId: ObjectId
  ): Promise<AffectedRecords>;
}

export interface ProfilesService {
  find(
    this: ProfilesService,
    options?: { rql?: RQLString }
  ): Promise<PagedResultWithPager<Profile>>;
  findById(
    this: ProfilesService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Profile>;
  findFirst(
    this: ProfilesService,
    options?: { rql?: RQLString }
  ): Promise<Profile>;
  create(this: ProfilesService, requestBody: ProfileCreation): Promise<Profile>;
  update(
    this: ProfilesService,
    rql: RQLString,
    requestBody: Profile
  ): Promise<AffectedRecords>;
  removeFields(
    this: ProfilesService,
    rql: RQLString,
    requestBody: {
      fields: Array<string>;
    }
  ): Promise<AffectedRecords>;
  getComorbidities(this: ProfilesService): Promise<PagedResult<Comorbidities>>;
  getImpediments(this: ProfilesService): Promise<PagedResult<Impediments>>;
}
