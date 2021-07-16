import type { JSONSchema7 } from './json-schema';
import type {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';

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

export type CreateMode = 'default' | 'permissionRequired';

/**
 * Specifies the conditions to be met in order to be able to view a document for a schema
 */
export type ReadMode = 'allUsers' | 'default' | 'enlistedInLinkedGroups';

/**
 * Specifies the conditions to be met in order to be able to update a document for a schema
 */

export type UpdateMode =
  | 'default'
  | 'creatorOnly'
  | 'disabled'
  | 'linkedGroupsStaffOnly';

/**
 * Specifies the conditions to be met in order to be able to delete a document for a schema
 */

export type DeleteMode = 'permissionRequired' | 'linkedUsersOnly';

export type GroupSyncMode =
  | 'disabled'
  | 'creatorPatientEnlistments'
  | 'linkedUsersPatientEnlistments';

interface BaseConfiguration {
  queryable?: boolean;
}

export interface ArrayConfiguration extends BaseConfiguration {
  type?: 'array';
  items?: TypeConfiguration;
  minItems?: number;
  maxItems?: number;
  contains?: TypeConfiguration;
}

export interface ObjectConfiguration extends BaseConfiguration {
  type?: 'object';
  properties?: Record<string, TypeConfiguration>;
  required?: string[];
}

export interface StringConfiguration extends BaseConfiguration {
  type?: 'string';
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  pattern?: string;
  format?: 'date-time';
}

export interface NumberConfiguration extends BaseConfiguration {
  type?: 'number';
  minimum?: number;
  maximum?: number;
  enum?: number[];
}

export interface BooleanConfiguration extends BaseConfiguration {
  type?: 'boolean';
}

export type TypeConfiguration =
  | ObjectConfiguration
  | ArrayConfiguration
  | StringConfiguration
  | NumberConfiguration
  | BooleanConfiguration;

export interface DocumentCondition {
  type?: 'document';
  configuration?: TypeConfiguration;
}

export interface InputCondition {
  type?: 'input';
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

export type CreationTransitionType = 'manual' | 'automatic';

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
  type: CreationTransitionType;
  conditions?: Condition[];
  actions?: TransitionAction[];
  afterActions?: TransitionAfterAction[];
}

export type StatusData = Record<string, string>;

export type TransitionInput = CreationTransition & {
  id?: ObjectId;
  name: string;
  fromStatuses: string[];
};

export type Transition = TransitionInput &
  Required<Pick<TransitionInput, 'id'>>;

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

export interface DataCommentsService {
  create(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    },
    options?: OptionsBase
  ): Promise<Comment>;
  find(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<PagedResult<Comment>>;
  findById(
    id: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Comment>;
  findFirst(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Comment>;
  update(
    commentId: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  remove(
    commentId: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataDocumentsService {
  assertNonLockedState(
    schemaId: ObjectId,
    documentId: ObjectId,
    tries: number,
    retryTimeInMs: number,
    options?: OptionsBase
  ): Promise<boolean>;
  create<CustomData = null>(
    schemaId: ObjectId,
    requestBody: Record<string, any>,
    options?: OptionsWithRql & { gzip?: boolean }
  ): Promise<Document<CustomData>>;
  find<CustomData = null>(
    schemaId: ObjectId,
    options?: OptionsWithRql
  ): Promise<PagedResult<Document<CustomData>>>;
  findById<CustomData = null>(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Document<CustomData>>;
  findFirst<CustomData = null>(
    schemaId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Document<CustomData>>;
  update(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: Record<string, any>,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  remove(schemaId: ObjectId, documentId: ObjectId): Promise<AffectedRecords>;
  removeFields(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  transition(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      id: ObjectId;
      data?: Record<string, any>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  linkGroups(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  unlinkGroups(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  linkUsers(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  unlinkUsers(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataIndexesService {
  create(
    schemaId: ObjectId,
    requestBody: IndexInput,
    options?: OptionsBase
  ): Promise<Index>;
  remove(
    indexId: ObjectId,
    schemaId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataPropertiesService {
  create(
    schemaId: ObjectId,
    requestBody: {
      name: string;
      configuration: TypeConfiguration;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  remove(
    schemaId: ObjectId,
    propertyPath: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  update(
    schemaId: ObjectId,
    propertyPath: string,
    requestBody: TypeConfiguration,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataSchemasService {
  create(requestBody: SchemaInput, options?: OptionsBase): Promise<Schema>;
  find(options?: OptionsWithRql): Promise<PagedResult<Schema>>;
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Schema>;
  findByName(name: string, options?: OptionsWithRql): Promise<Schema>;
  findFirst(options?: OptionsWithRql): Promise<Schema>;
  update(
    schemaId: ObjectId,
    requestBody: UpdateSchemaInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  remove(schemaId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;
  disable(schemaId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;
  enable(schemaId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;
}

export interface DataStatusesService {
  create(
    schemaId: ObjectId,
    requestBody: {
      name: string;
      data?: StatusData;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  update(
    schemaId: ObjectId,
    name: string,
    requestBody: StatusData,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  remove(
    schemaId: ObjectId,
    name: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataTransitionsService {
  updateCreation(
    schemaId: ObjectId,
    requestBody: CreationTransition,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  create(
    schemaId: ObjectId,
    requestBody: TransitionInput,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  update(
    schemaId: ObjectId,
    transitionId: ObjectId,
    requestBody: TransitionInput,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  remove(
    schemaId: ObjectId,
    transitionId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}
