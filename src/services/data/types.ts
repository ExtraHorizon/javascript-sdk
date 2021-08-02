import type { JSONSchema7 } from './json-schema';
import type { AffectedRecords, ObjectId, PagedResult } from '../types';
import { RQLString } from '../../rql';

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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody
   * @returns {Promise<Comment>}
   * @throws {LockedDocumentError}
   */
  create(
    this: DataCommentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param rql Add filters to the requested list.
   * @returns {Promise<PagedResult<Comment>>}
   */
  find(
    this: DataCommentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<Comment>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param schemaId the schema Id
   * @param documentId the document Id
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(
    this: DataCommentsService,
    id: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Comment>;
  /**
   * Find First
   * @param schemaId the schema Id
   * @param documentId the document Id
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(
    this: DataCommentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns {Promise<AffectedRecords>}
   */
  update(
    this: DataCommentsService,
    commentId: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns {Promise<AffectedRecords>}
   */
  remove(
    this: DataCommentsService,
    commentId: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId
  ): Promise<AffectedRecords>;
}

export interface DataDocumentsService {
  /**
   * Check if the document is not in a locked state
   *
   * Actions cannot be performed if the document has a transitionLock
   *
   * @param schemaId the schema Id
   * @param documentId the document Id
   * @returns boolean success
   */
  assertNonLockedState(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    tries: number,
    retryTimeInMs: number
  ): Promise<boolean>;
  /**
   * Create a document
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * `CREATE_DOCUMENTS` | `global` | When the schema.createMode is set to permissionRequired then this permission is required to make a group
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns {Document} document
   * @throws {IllegalArgumentError}
   */
  create<CustomData = null>(
    this: DataDocumentsService,
    schemaId: ObjectId,
    requestBody: Record<string, any>,
    options?: { gzip?: boolean }
  ): Promise<Document<CustomData>>;
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
   * @param schemaId The id of the targeted schema.
   * @param rql Add filters to the requested list.
   * @returns {Document} document
   */
  find<CustomData = null>(
    this: DataDocumentsService,
    schemaId: ObjectId,
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<Document<CustomData>>>;
  /**
   * Shortcut method to find a document by id
   *
   * Same Permissions as the find() method
   *
   * @param schemaId the schema Id
   * @param documentId the Id to search for
   * @param rql an optional rql string
   * @returns {Document} document
   */
  findById<CustomData = null>(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Document<CustomData>>;
  /**
   * Returns the first document that is found with the applied filter
   *
   * Same Permissions as the find() method
   * @param schemaId the schema Id
   * @param rql an optional rql string
   * @returns {Document} document
   */
  findFirst<CustomData = null>(
    this: DataDocumentsService,
    schemaId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Document<CustomData>>;
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param rql Add filters to the requested list.
   * @param requestBody Record<string, any>
   * @returns AffectedRecords
   */
  update(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: Record<string, any>,
    options?: {
      rql?: RQLString;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns AffectedRecords
   */
  remove(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param rql Add filters to the requested list.
   * @param requestBody list of fields
   * @returns AffectedRecords
   */
  removeFields(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param rql Add filters to the requested list.
   * @param requestBody
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  transition(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      id: ObjectId;
      data?: Record<string, any>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords>;
  /**
   * Link groups to a document
   *
   * Link the specified groups to a document.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_ACCESS_TO_DOCUMENT` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of groupIds
   * @returns AffectedRecords
   */
  linkGroups(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of groupIds
   * @returns AffectedRecords
   */
  unlinkGroups(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of userIds
   * @returns AffectedRecords
   */
  linkUsers(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @param requestBody list of userIds
   * @returns AffectedRecords
   */
  unlinkUsers(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    }
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
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns Index Success
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {IllegalStateError}
   */
  create(
    this: DataIndexesService,
    schemaId: ObjectId,
    requestBody: IndexInput
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
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   * @throws {NoPermissionError}
   * @throws {ResourceUnknownError}
   */
  remove(
    this: DataIndexesService,
    indexId: ObjectId,
    schemaId: ObjectId
  ): Promise<AffectedRecords>;
}

export interface DataPropertiesService {
  /**
   * Create a property
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody The name and configuration
   * @returns AffectedRecords
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {IllegalStateException}
   * @throws {ResourceUnknownException}
   */
  create(
    this: DataPropertiesService,
    schemaId: ObjectId,
    requestBody: {
      name: string;
      configuration: TypeConfiguration;
    }
  ): Promise<AffectedRecords>;
  /**
   * Delete a property
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param propertyPath The path to the property
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  remove(
    this: DataPropertiesService,
    schemaId: ObjectId,
    propertyPath: string
  ): Promise<AffectedRecords>;
  /**
   * Update a property
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param propertyPath The path to the property
   * @param requestBody The configuration
   * @returns AffectedRecords
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  update(
    this: DataPropertiesService,
    schemaId: ObjectId,
    propertyPath: string,
    requestBody: TypeConfiguration
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
  create(this: DataSchemasService, requestBody: SchemaInput): Promise<Schema>;
  /**
   * Request a list of schemas
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Schema>
   */
  find(
    this: DataSchemasService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Schema>>;
  /**
   * Request a list of all schemas
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Every one can use this endpoint
   * `DISABLE_SCHEMAS` | `global` | Includes disabled schemas in the response
   * @param rql Add filters to the requested list.
   * @returns Schema[]
   */
  findAll(options?: { rql?: RQLString }): Promise<Schema[]>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(
    this: DataSchemasService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Schema>;
  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findByName(
    this: DataSchemasService,
    name: string,
    options?: { rql?: RQLString }
  ): Promise<Schema>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(
    this: DataSchemasService,
    options?: { rql?: RQLString }
  ): Promise<Schema>;
  /**
   * Update a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody The schema input
   * @returns AffectedRecords
   */
  update(
    this: DataSchemasService,
    schemaId: ObjectId,
    requestBody: UpdateSchemaInput
  ): Promise<AffectedRecords>;
  /**
   * Delete a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   * @throws {IllegalStateError}
   */
  remove(
    this: DataSchemasService,
    schemaId: ObjectId
  ): Promise<AffectedRecords>;
  /**
   * Disable a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   */
  disable(
    this: DataSchemasService,
    schemaId: ObjectId
  ): Promise<AffectedRecords>;
  /**
   * Enable a schema
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DISABLE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @returns AffectedRecords
   */
  enable(
    this: DataSchemasService,
    schemaId: ObjectId
  ): Promise<AffectedRecords>;
}

export interface DataStatusesService {
  /**
   * Create a status
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody The name and status data
   * @returns AffectedRecords
   * @throws {ResourceAlreadyExistsError}
   */
  create(
    this: DataStatusesService,
    schemaId: ObjectId,
    requestBody: {
      name: string;
      data?: StatusData;
    }
  ): Promise<AffectedRecords>;
  /**
   * Update a status
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param name The name of the targeted status.
   * @param requestBody The status data
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  update(
    this: DataStatusesService,
    schemaId: ObjectId,
    name: string,
    requestBody: StatusData
  ): Promise<AffectedRecords>;
  /**
   * Delete a status
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param name The name of the targeted status.
   * @returns AffectedRecords
   * @throws {StatusInUseError}
   * @throws {ResourceUnknownError}
   */
  remove(
    this: DataStatusesService,
    schemaId: ObjectId,
    name: string
  ): Promise<AffectedRecords>;
}

export interface DataTransitionsService {
  /**
   * Update the creation transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  updateCreation(
    this: DataTransitionsService,
    schemaId: ObjectId,
    requestBody: CreationTransition
  ): Promise<AffectedRecords>;
  /**
   * Create a transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody TransitionInput
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   */
  create(
    this: DataTransitionsService,
    schemaId: ObjectId,
    requestBody: TransitionInput
  ): Promise<AffectedRecords>;
  /**
   * Update a transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @param requestBody
   * @returns {Promise<AffectedRecords>}
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  update(
    this: DataTransitionsService,
    schemaId: ObjectId,
    transitionId: ObjectId,
    requestBody: TransitionInput
  ): Promise<AffectedRecords>;
  /**
   * Delete a transition
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param transitionId The id of the targeted transition.
   * @returns {Promise<AffectedRecords>}
   * @throws {ResourceUnknownError}
   */
  remove(
    this: DataTransitionsService,
    schemaId: ObjectId,
    transitionId: ObjectId
  ): Promise<AffectedRecords>;
}
