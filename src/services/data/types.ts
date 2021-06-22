import type { JSONSchema7 } from './json-schema';
import type { ObjectId } from '../types';

export enum JSONSchemaType {
  OBJECT = 'object',
  ARRAY = 'array',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

export type JSONSchema =
  | JSONSchemaObject
  | JSONSchemaArray
  | JSONSchemaString
  | JSONSchemaNumber
  | JSONSchemaBoolean;

export type JSONSchemaObject = Pick<JSONSchema7, 'required'> & {
  type: JSONSchemaType.OBJECT;
  properties?: {
    [key: string]: JSONSchema;
  };
  additionalProperties?: JSONSchema;
};

export type JSONSchemaArray = Pick<JSONSchema7, 'minItems' | 'maxItems'> & {
  type: JSONSchemaType.ARRAY;
  items: JSONSchema | JSONSchema[];
  contains: JSONSchema;
};

export type JSONSchemaString = Pick<
  JSONSchema7,
  'minLength' | 'maxLength' | 'pattern' | 'enum'
> & {
  type: JSONSchemaType.STRING;
  const: string;
  format: 'date-time';
};
// format is static 'date-time

export type JSONSchemaNumber = Pick<
  JSONSchema7,
  'type' | 'minimum' | 'maximum' | 'enum'
> & {
  type: JSONSchemaType.NUMBER;
  const: number;
};

export type JSONSchemaBoolean = {
  type: JSONSchemaType.BOOLEAN;
  enum: boolean[];
  const: boolean;
};

/**
 * Specifies the conditions to be met in order to be able to create a document for a schema
 */
export enum CreateMode {
  DEFAULT = 'default',
  PERMISSION_REQUIRED = 'permissionRequired',
}

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

export enum ConfigurationType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  DATE_TIME = 'date-time',
  DOCUMENT = 'document',
  INPUT = 'input',
}

interface BaseConfiguration {
  queryable?: boolean;
}

export interface ArrayConfiguration extends BaseConfiguration {
  type?: ConfigurationType.ARRAY;
  items?: TypeConfiguration;
  minItems?: number;
  maxItems?: number;
  contains?: TypeConfiguration;
}

export interface ObjectConfiguration extends BaseConfiguration {
  type?: ConfigurationType.OBJECT;
  properties?: Record<string, TypeConfiguration>;
  required?: string[];
}

export interface StringConfiguration extends BaseConfiguration {
  type?: ConfigurationType.STRING;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  pattern?: string;
  format?: ConfigurationType.DATE_TIME;
}

export interface NumberConfiguration extends BaseConfiguration {
  type?: ConfigurationType.NUMBER;
  minimum?: number;
  maximum?: number;
  enum?: number[];
}

export interface BooleanConfiguration extends BaseConfiguration {
  type?: ConfigurationType.BOOLEAN;
}

export type TypeConfiguration =
  | ObjectConfiguration
  | ArrayConfiguration
  | StringConfiguration
  | NumberConfiguration
  | BooleanConfiguration;

export interface DocumentCondition {
  type?: ConfigurationType.DOCUMENT;
  configuration?: TypeConfiguration;
}

export interface InputCondition {
  type?: ConfigurationType.INPUT;
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

export enum CreationTransitionAction {
  ALGORITHM = 'algorithm',
  DELAY = 'delay',
  TASK = 'task',
  LINK_CREATOR = 'linkCreator',
  LINK_ENLISTED_GROUPS = 'linkEnlistedGroups',
  LINK_USER_FROM_DATA = 'linkUserFromData',
  LINK_GROUP_FROM_DATA = 'linkGroupFromData',
  MEASUREMENT_REVIEWED_NOTIFICATION = 'measurementReviewedNotification',
  SET = 'set',
  UNSET = 'unset',
  ADD_ITEMS = 'addItems',
  REMOVE_ITEMS = 'removeItems',
}

export enum CreationTransitionAfterAction {
  NOTIFY_ALGO_QUEUE_MANAGER = 'notifyAlgoQueueManager',
}

export interface CreationTransition {
  toStatus: string;
  type?: CreationTransitionType;
  conditions?: Condition[];
  actions?: { type: CreationTransitionAction }[];
  afterActions?: { type: CreationTransitionAfterAction }[];
}

export type StatusData = Record<string, string>;

export interface BaseTransition {
  id?: ObjectId;
  name?: string;
  fromStatuses?: string[];
}

export type Transition = CreationTransition & BaseTransition;

export type TransitionInput = Transition &
  Required<Pick<BaseTransition, 'name' | 'fromStatuses'>>;

export interface Schema {
  id?: ObjectId;
  name?: string;
  description?: string;
  properties?: any;
  statuses?: Record<string, never>;
  creationTransition?: CreationTransition;
  transitions?: Transition[];
  createMode?: CreateMode;
  readMode?: ReadMode;
  updateMode?: UpdateMode;
  deleteMode?: DeleteMode;
  groupSyncMode?: GroupSyncMode;
  defaultLimit?: number;
  maximumLimit?: number;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
  findTransitionIdByName?: (name: string) => ObjectId;
  transitionsByName?: Record<string, Transition>;
}

export interface SchemaInput {
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

export type UpdateSchemaInput = Pick<
  Partial<SchemaInput>,
  'name' | 'description' | 'defaultLimit' | 'maximumLimit'
>;

export type IndexFieldsName = string;

export enum IndexFieldsType {
  ASC = 'asc',
  DESC = 'desc',
  TEXT = 'text',
}

export interface IndexOptions {
  background?: boolean;
  unique?: boolean;
  sparse?: boolean;
}

export interface Index {
  id?: ObjectId;
  name?: string;
  fields?: {
    name?: IndexFieldsName;
    type?: IndexFieldsType;
  }[];
  options?: IndexOptions;
  system?: boolean;
}

export type IndexInput = Pick<Index, 'fields' | 'options'>;

export interface Document<CustomData = null> {
  id?: ObjectId;
  userIds?: ObjectId[];
  groupIds?: ObjectId[];
  status?: string;
  data?: CustomData extends null ? Record<string, unknown> : CustomData;
  transitionLock?: {
    timestamp?: Date;
  };
  commentCount?: number;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
  statusChangedTimestamp?: Date;
  creatorId?: ObjectId;
}

export type CommentText = string;

export interface Comment {
  id?: ObjectId;
  schemaId?: ObjectId;
  measurementId?: ObjectId;
  userId?: ObjectId;
  text?: CommentText;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
}
