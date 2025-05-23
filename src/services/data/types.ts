import { FindAllIterator } from '../../services/helpers';
import type {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
  PagedResultWithPager,
} from '../types';
import type { JSONSchema7 } from './json-schema';

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

export type RelationalAccessMode =
  | 'creator'
  | 'linkedUsers'
  | 'linkedGroupStaff'
  | 'linkedGroupPatients';

/**
 * Specifies the conditions to be met in order to be able to create a document for a schema
 */
export type CreateMode =
  | 'permissionRequired'
  | 'allUsers'

  /** @deprecated use 'allUsers' instead */
  | 'default';

/**
 * Specifies the conditions to be met in order to be able to view a document for a schema
 */
export type ReadMode =
  | 'permissionRequired'
  | 'allUsers'
  | Array<RelationalAccessMode>

  /** @deprecated use ['linkedUsers', 'linkedGroupStaff'] instead */
  | 'default'

  /** @deprecated use ['linkedGroupPatients', 'linkedGroupStaff'] instead */
  | 'enlistedInLinkedGroups';

/**
 * Specifies the conditions to be met in order to be able to update a document for a schema
 */
export type UpdateMode =
  | 'permissionRequired'
  | Array<RelationalAccessMode>

  /** @deprecated use ['linkedUsers', 'linkedGroupStaff'] instead */
  | 'default'

  /** @deprecated use ['creator'] instead */
  | 'creatorOnly'

  /** @deprecated use 'permissionRequired' instead */
  | 'disabled'

  /** @deprecated use ['linkedGroupStaff'] instead */
  | 'linkedGroupsStaffOnly';

/**
 * Specifies the conditions to be met in order to be able to delete a document for a schema
 */
export type DeleteMode =
  | 'permissionRequired'
  | Array<RelationalAccessMode>

  /** @deprecated use ['linkedUsers','linkedGroupStaff'] instead */
  | 'linkedUsersOnly';

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
  additionalProperties?: TypeConfiguration;
  required?: string[];
}

export interface StringConfiguration extends BaseConfiguration {
  type?: 'string';
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  pattern?: string;
  format?: 'date-time';
  const?: string;
}

export interface NumberConfiguration extends BaseConfiguration {
  type?: 'number';
  minimum?: number;
  maximum?: number;
  enum?: number[];
  const?: string;
}

export interface BooleanConfiguration extends BaseConfiguration {
  type?: 'boolean';
  enum?: boolean[];
  const?: boolean;
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
  functionName: string;
  priority?: number;
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
  type: 'linkUserFromData';
  userIdField: string;
}

export interface TransitionActionLinkGroupFromData {
  type: 'linkGroupFromData';
  groupIdField: string;
}

export interface TransitionActionDelay {
  type: 'delay';
  time: number;
}

/**
 * @deprecated Legacy action, should not be used in new projects
 */
export interface TransitionActionMeasurementReviewedNotification {
  type: 'measurementReviewedNotification';
}

/**
 * @deprecated Legacy action, the AlgoQueueManager does not exist anymore
 */
export interface TransitionActionNotifyAlgoQueueManager {
  type: 'notifyAlgoQueueManager';
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

export type TransitionAfterAction = TransitionActionNotifyAlgoQueueManager | TransitionActionTask;

export interface CreationTransition {
  toStatus: string;
  type: CreationTransitionType;
  conditions?: Condition[];
  actions?: TransitionAction[];
  afterActions?: TransitionAfterAction[];
}

export type StatusData = Record<string, string>;

export type TransitionInput = CreationTransition & {
  name?: string;
  fromStatuses: string[];
};

export type Transition = TransitionInput & {
  id: ObjectId;
};

export interface Schema {
  id: ObjectId;
  name: string;
  description: string;
  properties: Record<string, TypeConfiguration>;
  indexes: Index[];
  statuses: Record<string, Record<string, string>>;
  creationTransition: CreationTransition;
  transitions: Transition[];
  createMode: CreateMode;
  readMode: ReadMode;
  updateMode: UpdateMode;
  deleteMode: DeleteMode;
  groupSyncMode: GroupSyncMode;
  defaultLimit?: number;
  maximumLimit?: number;
  updateTimestamp: Date;
  creationTimestamp: Date;
  findTransitionIdByName?: (name: string) => ObjectId | undefined;
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

export type UpdateSchemaInput = Partial<SchemaInput>;

export type IndexFieldsName = string;

export type IndexFieldsType = 'asc' | 'desc' | 'text';

export interface IndexOptions {
  unique?: boolean;
  sparse?: boolean;
}

export interface Index {
  id: ObjectId;
  name: string;
  fields: {
    name: IndexFieldsName;
    type: IndexFieldsType;
  }[];
  options?: IndexOptions;
  system?: boolean;
}

export type IndexInput = Pick<Index, 'fields' | 'options'>;

export type TransitionDocumentInput = {
  id: ObjectId;
  name?: string;
  data?: Record<string, unknown>;
} | {
  id?: ObjectId;
  name: string;
  data?: Record<string, unknown>;
}

export interface Document<CustomData = null, CustomStatus = null> {
  id: ObjectId;
  userIds: ObjectId[];
  groupIds: ObjectId[];
  status: CustomStatus extends null ? string : CustomStatus;
  data: CustomData extends null ? Record<string, unknown> : CustomData;
  transitionLock?: {
    timestamp?: Date;
  };
  commentCount?: number;
  updateTimestamp: Date;
  creationTimestamp: Date;
  statusChangedTimestamp: Date;
  creatorId: ObjectId;
}

export type CommentText = string;

export interface Comment {
  id: ObjectId;
  schemaId: ObjectId;
  documentId: ObjectId;
  creatorId: ObjectId;
  text: CommentText;
  commentedTimestamp?: Date;
  updateTimestamp: Date;
  creationTimestamp: Date;
}

export interface DataCommentsService {
  /**
   * Create a comment
   *
   * Comment on the specified document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Comment on your own documents
   * `CREATE_DOCUMENT_COMMENTS` | `staff enlistment`  | Comment on any document belonging to the group
   * `CREATE_DOCUMENT_COMMENTS` | `global` | Comment on any document
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody
   * @returns {Promise<Comment>}
   * @throws {LockedDocumentError}
   */
  create(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    },
    options?: OptionsBase
  ): Promise<Comment>;
  /**
   * Request a list of comments
   *
   * List the comments for the specified document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | View comments for your own documents
   * `VIEW_DOCUMENT_COMMENTS` | `staff enlistment`  | View comments for any document belonging to the group
   * `VIEW_DOCUMENT_COMMENTS` | `global` | View the comments for any document
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns {Promise<PagedResult<Comment>>}
   */
  find(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<PagedResult<Comment>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns the first element found
   */
  findById(
    id: ObjectId,
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Comment>;
  /**
   * Find First
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns the first element found
   */
  findFirst(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Comment>;
  /**
   * Update a comment
   *
   * Update a comment you made.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your comments
   * `UPDATE_DOCUMENT_COMMENTS` | `global` | Update comments
   * @param commentId The id of the targeted comment.
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns {Promise<AffectedRecords>}
   */
  update(
    commentId: ObjectId,
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete a comment
   *
   * Delete a comments from the specified measurement.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete your comments
   * `UPDATE_DOCUMENT_COMMENTS` | `staff enlistment`  | Delete comments for any document belonging to the group
   * `UPDATE_DOCUMENT_COMMENTS` | `global` | Delete the comments for any document
   * @param commentId The id of the targeted comment.
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns {Promise<AffectedRecords>}
   */
  remove(
    commentId: ObjectId,
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataDocumentsService {
  /**
   * Check if the document is not in a locked state
   *
   * Actions cannot be performed if the document has a transitionLock
   *
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns boolean success
   * @throws {Error} If the document is in a locked state after the specified tries
   */
  assertNonLockedState(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    tries: number,
    retryTimeInMs: number,
    options?: OptionsBase
  ): Promise<boolean>;

  /**
   * # Create a document
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `CREATE_DOCUMENTS` | `global` | Create a document for any schema
   * `CREATE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Create a document for the specified schema
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General createMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * `"allUsers"` | All users can create a document
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy createMode value | Description
   * - | -
   * `"default"` | Translates to the `"allUsers"` general access mode value
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param requestBody
   * @returns {Document} document
   * @throws {IllegalArgumentError}
   */
  create<
    InputData = Record<string, any>,
    OutputData = null,
    CustomStatus = null
  >(
    schemaIdOrName: ObjectId | string,
    requestBody: InputData,
    options?: OptionsWithRql & { gzip?: boolean; }
  ): Promise<Document<OutputData, CustomStatus>>;

  /**
   * # Request a list of documents
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_DOCUMENTS` | `global` | View any document
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `global` | View any document of the specified schema
   * `VIEW_DOCUMENTS` | `staff_enlistment` | View any document belonging to the group
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | View any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General readMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * `"allUsers"` | All users can view any document of the specified schema
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational readMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can view the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can view the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can view the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can view the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"enlistedInLinkedGroups"` | Translates to `["linkedGroupPatients","linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns PagedResultWithPager<Document>
   */
  find<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): Promise<PagedResultWithPager<Document<CustomData, CustomStatus>>>;

  /**
   * # Request a list of all documents
   *
   * Do not pass in an rql with limit operator!
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_DOCUMENTS` | `global` | View any document
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `global` | View any document of the specified schema
   * `VIEW_DOCUMENTS` | `staff_enlistment` | View any document belonging to the group
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | View any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General readMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * `"allUsers"` | All users can view any document of the specified schema
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational readMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can view the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can view the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can view the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can view the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"enlistedInLinkedGroups"` | Translates to `["linkedGroupPatients","linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns Document[]
   */
  findAll<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): Promise<Document<CustomData, CustomStatus>[]>;

  /**
   * # Request a list of all documents and return a generator
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_DOCUMENTS` | `global` | View any document
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `global` | View any document of the specified schema
   * `VIEW_DOCUMENTS` | `staff_enlistment` | View any document belonging to the group
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | View any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General readMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * `"allUsers"` | All users can view any document of the specified schema
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational readMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can view the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can view the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can view the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can view the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"enlistedInLinkedGroups"` | Translates to `["linkedGroupPatients","linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns Document[]
   */
  findAllIterator<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): FindAllIterator<Document<CustomData, CustomStatus>>;

  /**
   * # Find a document by id
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_DOCUMENTS` | `global` | View any document
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `global` | View any document of the specified schema
   * `VIEW_DOCUMENTS` | `staff_enlistment` | View any document belonging to the group
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | View any document of the specified schema belonging to the group
   * <br>

   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General readMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * `"allUsers"` | All users can view any document of the specified schema
   * <br>

   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational readMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can view the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can view the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can view the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can view the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"enlistedInLinkedGroups"` | Translates to `["linkedGroupPatients","linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId the Id to search for
   * @returns {Document} document
   */
  findById<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Document<CustomData, CustomStatus> | undefined>;

  /**
   * # Find the first document that matches the applied filter
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `VIEW_DOCUMENTS` | `global` | View any document
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `global` | View any document of the specified schema
   * `VIEW_DOCUMENTS` | `staff_enlistment` | View any document belonging to the group
   * `VIEW_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | View any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General readMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * `"allUsers"` | All users can view any document of the specified schema
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational readMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can view the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can view the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can view the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can view the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"enlistedInLinkedGroups"` | Translates to `["linkedGroupPatients","linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns {Document} document
   */
  findFirst<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): Promise<Document<CustomData, CustomStatus> | undefined>;

  /**
   * # Update a document
   *
   * **Partially** update the selected document, provide `null` as a value to clear a field.
   * <br>
   * <br>
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_DOCUMENTS` | `global` | Update any document
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Update any document of the specified schema
   * `UPDATE_DOCUMENTS` | `staff_enlistment` | Update any document belonging to the group
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Update any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General updateMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational updateMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can update the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can update the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can update the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can update the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"creatorOnly"` | Translates to `["creator"]` relational access mode
   * `"disabled"` | Translates to the `"permissionRequired"` general access mode value
   * `"linkedGroupsStaffOnly"` | Translates to `["linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody Record<string, any>
   * @returns AffectedRecords
   */
  update<UpdateData = Record<string, any>>(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: UpdateData,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;

  /**
   * # Delete a document
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `DELETE_DOCUMENTS` | `global` | Delete any document
   * `DELETE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Delete any document of the specified schema
   * `DELETE_DOCUMENTS` | `staff_enlistment` | Delete any document belonging to the group
   * `DELETE_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Delete any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General deleteMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational deleteMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can delete the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can delete the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can delete the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can delete the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy deleteMode value | Description
   * - | -
   * `"linkedUsersOnly"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns AffectedRecords
   */
  remove(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * # Delete the specified fields from the selected document.
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_DOCUMENTS` | `global` | Update any document
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Update any document of the specified schema
   * `UPDATE_DOCUMENTS` | `staff_enlistment` | Update any document belonging to the group
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Update any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General updateMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational updateMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can update the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can update the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can update the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can update the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"creatorOnly"` | Translates to `["creator"]` relational access mode
   * `"disabled"` | Translates to the `"permissionRequired"` general access mode value
   * `"linkedGroupsStaffOnly"` | Translates to `["linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of fields
   * @returns AffectedRecords
   */
  removeFields(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;

  /**
   * # Append an object to an array
   *
   * Append an object to an array field in the selected document.
   *
   * When the object is appended to the array, the object will automatically be assigned a unique `id`.
   *
   * ## Example
   *
   * For a schema with the name `daily-summary`, a document looking like:
   *
   * ```json
   * {
   *   "id": "5f7b1b3b1f7b4b0001f7b4b2",
   *   "data": {
   *    "userId": "67e66ef64f0ea8488aba8f2f",
   *    "date": "2025-03-28",
   *    "hourlySummaries": [
   *      { "id": "6568d05351c0f5307421e196", "avg": 5, "max": 10, "min": 2 },
   *      { "id": "67e66793ae59de5bba4b262f", "avg": 7, "max": 15, "min": 3 }
   *    ]
   *   }
   * }
   * ```
   *
   * Appending an item to the `hourlySummaries`, looking like:
   *
   * ```json
   * {
   *   "avg": 10,
   *   "max": 20,
   *   "min": 5
   * }
   * ```
   *
   * Would be done like:
   *
   * ```ts
   * const documentId = '5f7b1b3b1f7b4b0001f7b4b2';
   * const hourlySummary = { avg: 10, max: 20, min: 5 };
   * await exh.data.documents.appendObjectToArray('daily-summary', documentId, 'hourlySummaries', hourlySummary);
   * ```
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_DOCUMENTS` | `global` | Update any document
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Update any document of the specified schema
   * `UPDATE_DOCUMENTS` | `staff_enlistment` | Update any document belonging to the group
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Update any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General updateMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational updateMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can update the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can update the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can update the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can update the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"creatorOnly"` | Translates to `["creator"]` relational access mode
   * `"disabled"` | Translates to the `"permissionRequired"` general access mode value
   * `"linkedGroupsStaffOnly"` | Translates to `["linkedGroupStaff"]` relational access mode
   */
  appendObjectToArray<UpdateData = Record<string, any>>(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    arrayField: string,
    requestBody: UpdateData,
    options?: OptionsBase,
  ): Promise<UpdateData & { id: ObjectId; }>;

  /**
   * # Update an object in an array
   *
   * Update an object in an array field in the selected document.
   *
   * ## Example
   *
   * For a schema with the name `daily-summary`, a document looking like:
   *
   * ```json
   * {
   *   "id": "5f7b1b3b1f7b4b0001f7b4b2",
   *   "data": {
   *     "userId": "67e66ef64f0ea8488aba8f2f",
   *     "date": "2025-03-28",
   *     "hourlySummaries": [
   *       { "id": "6568d05351c0f5307421e196", "avg": 5, "max": 10, "min": 2 },
   *       { "id": "67e66793ae59de5bba4b262f", "avg": 7, "max": 15, "min": 3 }
   *     ]
   *   }
   * }
   * ```
   *
   * Updating the object with the id `67e66793ae59de5bba4b262f` in the `hourlySummaries` array would be done like:
   *
   * ```ts
   * const documentId = '5f7b1b3b1f7b4b0001f7b4b2';
   * const objectId = '67e66793ae59de5bba4b262f';
   * const updateData = { avg: 8, max: 16, min: 4 };
   * await exh.data.documents.updateObjectInArray('daily-summary', documentId, 'hourlySummaries', objectId, updateData);
   * ```
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_DOCUMENTS` | `global` | Update any document
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Update any document of the specified schema
   * `UPDATE_DOCUMENTS` | `staff_enlistment` | Update any document belonging to the group
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Update any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General updateMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational updateMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can update the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can update the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can update the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can update the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"creatorOnly"` | Translates to `["creator"]` relational access mode
   * `"disabled"` | Translates to the `"permissionRequired"` general access mode value
   * `"linkedGroupsStaffOnly"` | Translates to `["linkedGroupStaff"]` relational access mode
   */
  updateObjectInArray<UpdateData = Record<string, any>>(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    arrayField: string,
    objectId: ObjectId,
    requestBody: UpdateData,
    options?: OptionsBase,
  ): Promise<AffectedRecords>;

  /**
   * # Remove an object from an array
   *
   * Remove an object from an array field in the selected document.
   *
   * ## Example
   *
   * For a schema with the name `daily-summary`, a document looking like:
   *
   * ```json
   * {
   *   "id": "5f7b1b3b1f7b4b0001f7b4b2",
   *   "data": {
   *     "userId": "67e66ef64f0ea8488aba8f2f",
   *     "date": "2025-03-28",
   *     "hourlySummaries": [
   *       { "id": "6568d05351c0f5307421e196", "avg": 5, "max": 10, "min": 2 },
   *       { "id": "67e66793ae59de5bba4b262f", "avg": 7, "max": 15, "min": 3 }
   *     ]
   *   }
   * }
   * ```
   *
   * Removing the object with the id `67e66793ae59de5bba4b262f` from the `hourlySummaries` array would be done like:
   *
   * ```ts
   * const documentId = '5f7b1b3b1f7b4b0001f7b4b2';
   * const objectId = '67e66793ae59de5bba4b262f';
   * await exh.data.documents.removeObjectFromArray('daily-summary', documentId, 'hourlySummaries', objectId);
   * ```
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_DOCUMENTS` | `global` | Update any document
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Update any document of the specified schema
   * `UPDATE_DOCUMENTS` | `staff_enlistment` | Update any document belonging to the group
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Update any document of the specified schema belonging to the group
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General updateMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational updateMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can update the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can update the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can update the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can update the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"creatorOnly"` | Translates to `["creator"]` relational access mode
   * `"disabled"` | Translates to the `"permissionRequired"` general access mode value
   * `"linkedGroupsStaffOnly"` | Translates to `["linkedGroupStaff"]` relational access mode
   */
  removeObjectFromArray(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    arrayField: string,
    objectId: ObjectId,
    options?: OptionsBase,
  ): Promise<AffectedRecords>;

  /**
   * # Transition a document
   *
   * Start a transition manually for the selected document where the conditions of a manual transition are met.
   *
   * Note: the `id` or `name` in the requestBody are the `id` or `name` of the transition.
   *
   * ## Access via permissions
   * Regardless of how the access modes (described below) are set, a user is always able to perform an operation on a document if they are assigned a specific permission.  This permission can come from a global role of the user or a staff enlistment role the user has in the group of the document.
   * Permission | Scopes | Effect
   * - | - | -
   * `UPDATE_DOCUMENTS` | `global` | Update any document
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `global` | Update any document of the specified schema
   * `UPDATE_DOCUMENTS` | `staff_enlistment` | Update any document belonging to the group
   * `UPDATE_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Update any document of the specified schema belonging to the group
   * `TRANSITION_DOCUMENTS` | `global` | Transition any document
   * `TRANSITION_DOCUMENTS:{SCHEMA_NAME}` | `global` | Transition any document of the specified schema
   * `TRANSITION_DOCUMENTS:{SCHEMA_NAME}:{TRANSITION_NAME}` | `global` | Transition any document of the specified schema with the specified transition name
   * `TRANSITION_DOCUMENTS` | `staff_enlistment` | Transition any document belonging to the group
   * `TRANSITION_DOCUMENTS:{SCHEMA_NAME}` | `staff_enlistment` | Transition any document of the specified schema belonging to the group
   * `TRANSITION_DOCUMENTS:{SCHEMA_NAME}:{TRANSITION_NAME}` | `staff_enlistment` | Transition any document of the specified schema belonging to the group with the specified transition name
   * <br>
   *
   * ## General access mode values
   * The general access mode values determine if a user requires permission to perform the action for the Schema. A general access mode value is provided as one of the following strings.
   * General updateMode value | Description
   * - | -
   * `"permissionRequired"` | The permissions above apply
   * <br>
   *
   * ## Relational access mode values
   * Relational access mode values are supplied as an array. When multiple relational access mode values are supplied, a user adhering to any relation in this array is allowed to perform the action on the document.
   * Relational updateMode value | Description
   * - | -
   * `["creator"]` | The user that created the document can update the document.
   * `["linkedUsers"]` |  All users where their user id is in the list of userIds of the document can update the document.
   * `["linkedGroupPatients"]` | All users that have a patient enlistment in a group that is in the list of groupIds of the document can update the document.
   * `["linkedGroupStaff"]` | All users that have a staff enlistment in a group that is in the list of groupIds of the document can update the document.
   * <br>
   *
   * ## Legacy access mode values
   * Listed below are the deprecated values with their current equivalent
   * Legacy updateMode value | Description
   * - | -
   * `"default"` | Translates to `["linkedUsers","linkedGroupStaff"]` relational access mode
   * `"creatorOnly"` | Translates to `["creator"]` relational access mode
   * `"disabled"` | Translates to the `"permissionRequired"` general access mode value
   * `"linkedGroupsStaffOnly"` | Translates to `["linkedGroupStaff"]` relational access mode
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  transition(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: TransitionDocumentInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;

  /**
   * # Link groups to a document
   *
   * Link the specified groups to a document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Link groups to all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Link groups to the documents of the specified schema
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of groupIds
   * @returns AffectedRecords
   */
  linkGroups(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * @deprecated Use `unlinkGroups(schemaIdOrName, documentId, groupIds)` or `unlinkAllGroups(schemaIdOrName, documentId)` instead.
   *
   * # Unlink groups from a document
   *
   * Unlink the specified groups from a document
   *
   * Specifying an **empty** `groupIds` array will have **no effect** on the document.
   *
   * **Not** specifying the `groupIds` array will **unlink all** groups from the document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Unlink groups for all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Unlink groups for the documents of the specified schema
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of groupIds
   * @returns AffectedRecords
   */
  unlinkGroups(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      groupIds?: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * # Unlink groups from a document
   *
   * Unlink the specified groups from a document
   *
   * Specifying an **empty** `groupIds` array will have **no effect** on the document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Unlink groups for all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Unlink groups for the documents of the specified schema
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param groupIds list of groupIds
   * @returns AffectedRecords
   */
  unlinkGroups(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    groupIds: Array<ObjectId>,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * # Unlink all groups from a document
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Unlink groups for all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Unlink groups for the documents of the specified schema
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns AffectedRecords
   */
  unlinkAllGroups(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * # Link users to a document
   *
   * Link the specified users to a document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Link users to all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Link users to all documents of the specified schema
   *
   * Note: When GroupSyncMode.LINKED_USERS_PATIENT_ENLISTMENT is set for a document, all the groups where the specified user is enlisted as patient will also be added to the document.
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of userIds
   * @returns AffectedRecords
   */
  linkUsers(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * @deprecated Use `unlinkUsers(schemaIdOrName, documentId, userIds)` or `unlinkAllUsers(schemaIdOrName, documentId)` instead.
   *
   * # Unlink users from a document
   *
   * Unlink the specified users from a document.
   *
   * Specifying an **empty** `userIds` array will have **no effect** on the document.
   *
   * **Not** specifying the `userIds` array will **unlink all** users from the document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Unlink users to all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Unlink users to all documents of the specified schema
   *
   * Note: When GroupSyncMode.LINKED_USERS_PATIENT_ENLISTMENT is set for a document, all the groups where the specified user is enlisted as patient will also be removed from the document.
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of userIds
   * @returns AffectedRecords
   */
  unlinkUsers(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      userIds?: Array<ObjectId>;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * # Unlink users from a document
   *
   * Unlink the specified users from a document.
   *
   * Specifying an **empty** `userIds` array will have **no effect** on the document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Unlink users to all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Unlink users to all documents of the specified schema
   *
   * Note: When GroupSyncMode.LINKED_USERS_PATIENT_ENLISTMENT is set for a document, all the groups where the specified user is enlisted as patient will also be removed from the document.
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param userIds list of userIds
   * @param requestBody list of userIds
   * @returns AffectedRecords
   */
  unlinkUsers(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    userIds: Array<ObjectId>,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * # Unlink all users from a document
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | Unlink users to all documents
   * `UPDATE_ACCESS_TO_DOCUMENT:{SCHEMA_NAME}` | `global` | Unlink users to all documents of the specified schema
   *
   * Note: When GroupSyncMode.LINKED_USERS_PATIENT_ENLISTMENT is set for a document, all the groups where the specified user is enlisted as patient will also be removed from the document.
   *
   * # Interface
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of userIds
   * @returns AffectedRecords
   */
  unlinkAllUsers(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataIndexesService {
  /**
   * Create an index
   *
   * Set an index on a specific property in a schema.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global`  | **Required** for this endpoint: Create an index
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param requestBody
   * @returns Index Success
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {IllegalStateError}
   */
  create(
    schemaIdOrName: ObjectId | string,
    requestBody: IndexInput,
    options?: OptionsBase
  ): Promise<Index>;
  /**
   * Delete an existing index
   *
   * Delete an index for a specific property in a schema.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global`  | **Required** for this endpoint: Delete an index
   * @param indexId The id of the targeted index.
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns AffectedRecords
   * @throws {NoPermissionError}
   * @throws {ResourceUnknownError}
   */
  remove(
    indexId: ObjectId,
    schemaIdOrName: ObjectId | string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataPropertiesService {
  /**
   * Create a property
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param requestBody The name and configuration
   * @returns AffectedRecords
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {IllegalStateException}
   * @throws {ResourceUnknownException}
   */
  create(
    schemaIdOrName: ObjectId | string,
    requestBody: {
      name: string;
      configuration: TypeConfiguration;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete a property
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param propertyPath The path to the property
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  remove(
    schemaIdOrName: ObjectId | string,
    propertyPath: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Update a property
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param propertyPath The path to the property
   * @param requestBody The configuration
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  update(
    schemaIdOrName: ObjectId | string,
    propertyPath: string,
    requestBody: TypeConfiguration,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataSchemasService {
  /**
   * Create a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Schema successful operation
   */
  create(requestBody: SchemaInput, options?: OptionsBase): Promise<Schema>;
  /**
   * Request a list of schemas
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @returns PagedResultWithPager<Schema>
   */
  find(options?: OptionsWithRql): Promise<PagedResultWithPager<Schema>>;
  /**
   * Request a list of all schemas
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @returns Schema[]
   */
  findAll(options?: OptionsWithRql): Promise<Schema[]>;
  /**
   * Request a list of all schemas and returns a generator
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @returns Schema[]
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<Schema>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Schema>;
  /**
   * Find By Name
   * @param name the name to search for
   * @returns the first element found
   */
  findByName(name: string, options?: OptionsWithRql): Promise<Schema>;
  /**
   * Find First
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Schema>;
  /**
   * Update a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param requestBody The schema input
   * @returns AffectedRecords
   */
  update(
    schemaIdOrName: ObjectId | string,
    requestBody: UpdateSchemaInput,
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  /**
   * Delete a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns AffectedRecords
   * @throws {IllegalStateError}
   */
  remove(schemaIdOrName: ObjectId | string, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Disable a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns AffectedRecords
   */
  disable(schemaIdOrName: ObjectId | string, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Enable a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns AffectedRecords
   */
  enable(schemaIdOrName: ObjectId | string, options?: OptionsBase): Promise<AffectedRecords>;
}

export interface DataStatusesService {
  /**
   * Create a status
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param requestBody The name and status data
   * @returns AffectedRecords
   * @throws {ResourceAlreadyExistsError}
   */
  create(
    schemaIdOrName: ObjectId | string,
    requestBody: {
      name: string;
      data?: StatusData;
    },
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Update a status
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param name The name of the targeted status.
   * @param requestBody The status data
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  update(
    schemaIdOrName: ObjectId | string,
    name: string,
    requestBody: StatusData,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete a status
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param name The name of the targeted status.
   * @returns AffectedRecords
   * @throws {StatusInUseError}
   * @throws {ResourceUnknownError}
   */
  remove(
    schemaIdOrName: ObjectId | string,
    name: string,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface DataTransitionsService {
  /**
   * Update the creation transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  updateCreation(
    schemaIdOrName: ObjectId | string,
    requestBody: CreationTransition,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Create a transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param requestBody TransitionInput
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  create(
    schemaIdOrName: ObjectId | string,
    requestBody: TransitionInput,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Update a transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  update(
    schemaIdOrName: ObjectId | string,
    transitionId: ObjectId,
    requestBody: TransitionInput,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete a transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @returns {Promise<AffectedRecords>}
   * @throws {ResourceUnknownError}
   */
  remove(
    schemaIdOrName: ObjectId | string,
    transitionId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}
