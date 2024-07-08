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
  id: ObjectId;
  name: string;
  description: string;
  // FIXME: type all possible property types
  properties: Record<string, any>;
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
   * Create a document
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * `CREATE_DOCUMENTS` | `global` | When the schema.createMode is set to permissionRequired then this permission is required to make a group
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
   * Request a list of documents
   *
   * ReadMode on schema is set to 'default' (or the property is not set at all on the schema):
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See your own documents
   * none | `staff enlistment` | See the documents belonging to the group (and your own documents)
   * `VIEW_DOCUMENTS` | `global` | See any document
   *
   * ReadMode on schema is set to 'allUsers':
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See any document
   *
   * ReadMode on schema is set to 'enlistedInLinkedGroups':
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See the documents belonging to the group
   * none | `staff enlistment` | See the documents belonging to the group
   * `VIEW_DOCUMENTS` | `global` | See any document
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns PagedResultWithPager<Document>
   */
  find<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): Promise<PagedResultWithPager<Document<CustomData, CustomStatus>>>;
  /**
   * Request a list of all documents
   *
   * Do not pass in an rql with limit operator!
   *
   * ReadMode on schema is set to 'default' (or the property is not set at all on the schema):
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See your own documents
   * none | `staff enlistment` | See the documents belonging to the group (and your own documents)
   * `VIEW_DOCUMENTS` | `global` | See any document
   *
   * ReadMode on schema is set to 'allUsers':
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See any document
   *
   * ReadMode on schema is set to 'enlistedInLinkedGroups':
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See the documents belonging to the group
   * none | `staff enlistment` | See the documents belonging to the group
   * `VIEW_DOCUMENTS` | `global` | See any document
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns Document[]
   */
  findAll<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): Promise<Document<CustomData, CustomStatus>[]>;
  /**
   * Request a list of all documents and return a generator
   *
   * ReadMode on schema is set to 'default' (or the property is not set at all on the schema):
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See your own documents
   * none | `staff enlistment` | See the documents belonging to the group (and your own documents)
   * `VIEW_DOCUMENTS` | `global` | See any document
   *
   * ReadMode on schema is set to 'allUsers':
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | See any document
   *
   * ReadMode on schema is set to 'enlistedInLinkedGroups':
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See the documents belonging to the group
   * none | `staff enlistment` | See the documents belonging to the group
   * `VIEW_DOCUMENTS` | `global` | See any document
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns Document[]
   */
  findAllIterator<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): FindAllIterator<Document<CustomData, CustomStatus>>;
  /**
   * Shortcut method to find a document by id
   *
   * Same Permissions as the find() method
   *
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
   * Returns the first document that is found with the applied filter
   *
   * Same Permissions as the find() method
   * @param schemaIdOrName The id or name of the targeted schema.
   * @returns {Document} document
   */
  findFirst<CustomData = null, CustomStatus = null>(
    schemaIdOrName: ObjectId | string,
    options?: OptionsWithRql
  ): Promise<Document<CustomData, CustomStatus> | undefined>;
  /**
   * Update a document
   *
   * **Partially** update the selected document. Use a `null` value to clear a field.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own documents
   * none | `staff enlistment`  | Update all the documents belonging to the group
   * `UPDATE_DOCUMENTS` | `global` | Update all the documents
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
   * Delete a document
   *
   * DeleteMode on schema is set to 'permissionRequired':
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_DOCUMENTS` | `global` | **Required** for this endpoint
   *
   * DeleteMode on schema is set to 'linkedUsersOnly':
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete the document if the userId is linked to the document
   * none | `staff enlistment`  | Delete the document if the groupId is linked
   * `DELETE_DOCUMENTS` | `global` | Delete the document
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
   * Delete fields from a document
   *
   * Delete the specified fields from the selected document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own documents
   * none | `staff enlistment`  | Update all the documents belonging to the group
   * `UPDATE_DOCUMENTS` | `global` | Update all the documents
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
   * Transition a document
   *
   * Start a transition manually for the selected document where the conditions of a manual transition are met.
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your own documents
   * none | `staff enlistment`  | Update all the documents belonging to the group
   * `UPDATE_DOCUMENTS` | `global` | Update all the documents
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
    requestBody: {
      id: ObjectId;
      data?: Record<string, any>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords>;
  /**
   * Link groups to a document
   *
   * Link the specified groups to a document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | **Required** for this endpoint
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
   * Unlink groups from a document
   *
   * Unlink the specified groups from a document
   *
   * Specifying an **empty** `groupIds` array will have **no effect** on the document.
   *
   * **Not** specifying the `groupIds` array will **unlink all** groups from the document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | **Required** for this endpoint
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
   * Link users to a document
   *
   * Link the specified users to a document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | **Required** for this endpoint
   *
   * Note: When GroupSyncMode.LINKED_USERS_PATIENT_ENLISTMENT is set for a document, all the groups where the specified user is enlisted as patient will also be added to the document.
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
   * Unlink users from a document
   *
   * Unlink the specified users from a document.
   *
   * Specifying an **empty** `userIds` array will have **no effect** on the document.
   *
   * **Not** specifying the `userIds` array will **unlink all** users from the document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | **Required** for this endpoint
   *
   * Note: When GroupSyncMode.LINKED_USERS_PATIENT_ENLISTMENT is set for a document, all the groups where the specified user is enlisted as patient will also be removed from the document.
   * @param schemaIdOrName The id or name of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of userIds
   * @returns AffectedRecords
   */
  unlinkUsers(
    schemaIdOrName: ObjectId | string,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    },
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
