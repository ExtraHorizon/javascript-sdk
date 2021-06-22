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

type CreateMode = 'default' | 'permissionRequired';

/**
 * Specifies the conditions to be met in order to be able to view a document for a schema
 */
type ReadMode = 'allUsers' | 'default' | 'enlistedInLinkedGroups';

/**
 * Specifies the conditions to be met in order to be able to update a document for a schema
 */

type UpdateMode =
  | 'default'
  | 'creatorOnly'
  | 'disabled'
  | 'linkedGroupsStaffOnly';

/**
 * Specifies the conditions to be met in order to be able to delete a document for a schema
 */

type DeleteMode = 'permissionRequired' | 'linkedUsersOnly';

type GroupSyncMode =
  | 'disabled'
  | 'creatorPatientEnlistments'
  | 'linkedUsersPatientEnlistments';

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

export interface InitiatorHasRelationToUserInDataCondition {
  type?: 'initiatorHasRelationToUserInData';
  userIdField?: ObjectId;
  relation?: 'isStaffOfTargetPatient';
}

export type InitiatorHasRelationToGroupInDataConditionRelation =
  | 'staff'
  | 'patient';

export interface InitiatorHasRelationToGroupInDataCondition {
  type?: 'initiatorHasRelationToGroupInData';
  groupIdField?: ObjectId;
  relation?: InitiatorHasRelationToGroupInDataConditionRelation;
  requiredPermission?: string;
}

export type Condition =
  | InputCondition
  | DocumentCondition
  | InitiatorHasRelationToUserInDataCondition
  | InitiatorHasRelationToGroupInDataCondition;

type CreationTransitionType = 'manual' | 'automatic';

export interface TransitionActionSet {
  type: 'set';
  field: string;
  value: unknown;
}

export interface TransitionActionUnset {
  type: 'unset';
  field: string[];
}

export interface TransitionActionAddItems {
  type: 'addItems';
  field: string;
  values: string[];
}

export interface TransitionActionRemoveItems {
  type: 'removeItems';
  field: string;
  values: string[];
}

export interface TransitionActionTask {
  type: 'task';
  functioName: string;
  data: Record<string, unknown>;
}

export interface TransitionActionLinkCreator {
  type: 'linkCreator';
}

export interface TransitionActionLinkEnlistedGroups {
  type: 'linkEnlistedGroups';
  onlyActive: boolean;
}

export interface TransitionActionLinkUserFromData {
  type: 'linkGroupFromData';
  userIdField: string;
}
export interface TransitionActionLinkGroupFromData {
  type: 'linkUserFromData';
  groupIdField: string;
}

export interface TransitionActionDelay {
  type: 'delay';
  time: number;
}

export interface TransitionActionMeasurementReviewedNotification {
  type: 'measurementReviewedNotification';
}

export type TransitionAction =
  | TransitionActionSet
  | TransitionActionUnset
  | TransitionActionAddItems
  | TransitionActionRemoveItems
  | TransitionActionTask
  | TransitionActionLinkCreator
  | TransitionActionLinkEnlistedGroups
  | TransitionActionLinkUserFromData
  | TransitionActionLinkGroupFromData
  | TransitionActionDelay
  | TransitionActionMeasurementReviewedNotification;

export interface TransitionAfterAction {
  type: 'notifyAlgoQueueManager';
  id: string;
  version: string;
}

export interface CreationTransition {
  toStatus: string;
  type?: CreationTransitionType;
  conditions?: Condition[];
  actions?: TransitionAction[];
  afterActions?: TransitionAfterAction[];
}

export type StatusData = Record<string, string>;

export type Transition = CreationTransition & {
  id: ObjectId;
  name: string;
  fromStatuses: string[];
};

export type TransitionInput = Transition & Partial<Pick<Transition, 'id'>>;

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

export type IndexFieldsType = 'asc' | 'desc' | 'text';

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
