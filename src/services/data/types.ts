import type { ObjectId } from '../models/ObjectId';

/**
 * Specifies the conditions to be met in order to be able to create a document for a schema
 */
export enum CreateMode {
  DEFAULT = 'default',
  PERMISSION_REQUIRED = 'permissionRequired',
}

export enum ArrayConfigurationType {
  ARRAY = 'array',
}

export interface IArrayConfiguration {
  type?: ArrayConfigurationType;
  items?: TypeConfiguration;
  minItems?: number;
  maxItems?: number;
  contains?: TypeConfiguration;
}

export interface BaseTypeOptions {
  queryable?: boolean;
}

export type ArrayConfiguration = IArrayConfiguration & BaseTypeOptions;

export enum ObjectConfigurationType {
  OBJECT = 'object',
}

export interface IObjectConfiguration {
  type?: ObjectConfigurationType;
  properties?: Record<string, TypeConfiguration>;
  required?: Array<string>;
}

export type ObjectConfiguration = IObjectConfiguration & BaseTypeOptions;

export enum StringConfigurationType {
  STRING = 'string',
}

export enum StringConfigurationFormat {
  DATE_TIME = 'date-time',
}

export interface IStringConfiguration {
  type?: StringConfigurationType;
  minLength?: number;
  maxLength?: number;
  enum?: Array<string>;
  pattern?: string;
  format?: StringConfigurationFormat;
}

export type StringConfiguration = IStringConfiguration & BaseTypeOptions;

export enum NumberConfigurationType {
  STRING = 'string',
}

export interface INumberConfiguration {
  type?: NumberConfigurationType;
  minimum?: number;
  maximum?: number;
  enum?: Array<number>;
}

export type NumberConfiguration = INumberConfiguration & BaseTypeOptions;

export enum BooleanConfigurationType {
  BOOLEAN = 'boolean',
}

export interface IBooleanConfiguration {
  type?: BooleanConfigurationType;
}

export type BooleanConfiguration = IBooleanConfiguration & BaseTypeOptions;

export type TypeConfiguration =
  | ObjectConfiguration
  | ArrayConfiguration
  | StringConfiguration
  | NumberConfiguration
  | BooleanConfiguration;

export enum DocumentConditionType {
  DOCUMENT = 'document',
}

export interface DocumentCondition {
  type?: DocumentConditionType;
  configuration?: TypeConfiguration;
}

export enum InputConditionType {
  INPUT = 'input',
}

export interface InputCondition {
  type?: InputConditionType;
  configuration?: TypeConfiguration;
}

export enum InitiatorHasRelationToUserInDataConditionType {
  INITIATOR_HAS_RELATION_TO_USER_IN_DATA = 'initiatorHasRelationToUserInData',
}

export enum InitiatorHasRelationToUserInDataConditionRelation {
  IS_STAFF_OF_TARGET_PATIENT = 'isStaffOfTargetPatient',
}

export interface InitiatorHasRelationToUserInDataCondition {
  type?: InitiatorHasRelationToUserInDataConditionType;
  userIdField?: ObjectId;
  relation?: InitiatorHasRelationToUserInDataConditionRelation;
}

export enum InitiatorHasRelationToGroupInDataConditionType {
  INITIATOR_HAS_RELATION_TO_GROUP_IN_DATA = 'initiatorHasRelationToGroupInData',
}

export enum InitiatorHasRelationToGroupInDataConditionRelation {
  STAFF = 'staff',
  PATIENT = 'patient',
}

export interface InitiatorHasRelationToGroupInDataCondition {
  type?: InitiatorHasRelationToGroupInDataConditionType;
  groupIdField?: ObjectId;
  relation?: InitiatorHasRelationToGroupInDataConditionRelation;
  requiredPermission?: string;
}

export type Condition =
  | InputCondition
  | DocumentCondition
  | InitiatorHasRelationToUserInDataCondition
  | InitiatorHasRelationToGroupInDataCondition;

export enum CreationTransitionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
}

export interface CreationTransition {
  toStatus?: string;
  type?: CreationTransitionType;
  conditions?: Array<Condition>;
  actions?: Array<{
    type?:
      | 'algorithm'
      | 'delay'
      | 'task'
      | 'linkCreator'
      | 'linkEnlistedGroups'
      | 'linkUserFromData'
      | 'linkGroupFromData'
      | 'measurementReviewedNotification'
      | 'set'
      | 'unset'
      | 'addItems'
      | 'removeItems';
  }>;
  afterActions?: Array<{
    type?: 'notifyAlgoQueueManager';
  }>;
}

export type StatusData = Record<string, string>;

export interface ITransition {
  name?: string;
  fromStatuses?: Array<string>;
}

export type Transition = CreationTransition & ITransition;

/**
 * Specifies the conditions to be met in order to be able to view a document for a schema
 */
export enum ReadMode {
  ALL_USERS = 'allUsers',
  DEFAULT = 'default',
  ENLISTED_IN_LINKED_GROUPS = 'enlistedInLinkedGroups',
}

/**
 * Specifies the conditions to be met in order to be able to update a document for a schema
 */
export enum UpdateMode {
  DEFAULT = 'default',
  CREATOR_ONLY = 'creatorOnly',
  DISABLED = 'disabled',
  LINKED_GROUPS_STAFF_ONLY = 'linkedGroupsStaffOnly',
}

/**
 * Specifies the conditions to be met in order to be able to delete a document for a schema
 */
export enum DeleteMode {
  PERMISSION_REQUIRED = 'permissionRequired',
  LINKED_USERS_ONLY = 'linkedUsersOnly',
}

export enum GroupSyncMode {
  DISABLED = 'disabled',
  CREATOR_PATIENT_ENLISTMENTS = 'creatorPatientEnlistments',
  LINKED_USERS_PATIENT_ENLISTMENTS = 'linkedUsersPatientEnlistments',
}

export interface Schema {
  id?: ObjectId;
  name?: string;
  description?: string;
  properties?: {
    additionalProperties?: TypeConfiguration;
  };
  statuses?: Record<string, StatusData>;
  creationTransition?: CreationTransition;
  transitions?: Array<Transition>;
  createMode?: CreateMode;
  readMode?: ReadMode;
  updateMode?: UpdateMode;
  deleteMode?: DeleteMode;
  groupSyncMode?: GroupSyncMode;
  defaultLimit?: number;
  maximumLimit?: number;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
}

export interface InputSchema {
  name: string;
  description: string;
  createMode?: CreateMode;
  readMode?: ReadMode;
  updateMode?: UpdateMode;
  deleteMode?: DeleteMode;
  groupSyncMode?: GroupSyncMode;
  defaultLimit?: number;
  maximumLimit?: number;
}
