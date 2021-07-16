import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { delay } from '../../utils';
import { HttpClient } from '../http-client';
import type {
  ObjectId,
  AffectedRecords,
  PagedResult,
  OptionsBase,
  OptionsWithRql,
} from '../types';
import { DataDocumentsService, Document } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataDocumentsService => ({
  // TypeScript limitation. Function using optional generic with fallback can not be first function.
  /**
   * Check if the document is not in a locked state
   * Actions cannot be performed if the document has a transitionLock
   *
   * @param schemaId the schema Id
   * @param documentId the document Id
   * @returns boolean success
   */
  async assertNonLockedState(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    tries = 5,
    retryTimeInMs = 300,
    options?: OptionsBase
  ): Promise<boolean> {
    if (tries < 1) {
      throw new Error('Document is in a locked state');
    }

    const res = await this.findById(schemaId, documentId, options);
    if (!res.transitionLock) {
      return true;
    }

    await delay(retryTimeInMs);

    return this.assertNonLockedState(
      schemaId,
      documentId,
      tries - 1,
      retryTimeInMs,
      options
    );
  },

  /**
   * Create a document
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * `CREATE_DOCUMENTS` | `global` | When the schema.createMode is set to permissionRequired then this permission is required to make a group
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns {Document} document
   * @throws {IllegalArgumentError}
   */
  async create<CustomData = null>(
    schemaId: ObjectId,
    requestBody: Record<string, any>,
    options?: OptionsWithRql & { gzip?: boolean }
  ): Promise<Document<CustomData>> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents`,
        requestBody,
        options?.headers ? { headers: options.headers } : {},
        options
      )
    ).data;
  },

  /**
   * Request a list of documents
   * ReadMode on schema is set to 'default' (or the property is not set at all on the schema):
   * Permission | Scope | Effect
   * - | - | -
   * none | | See your own documents
   * none | `staff enlistment` | See the documents belonging to the group (and your own documents)
   * `VIEW_DOCUMENTS` | `global` | See any document
   *
   * ReadMode on schema is set to 'allUsers':
   * Permission | Scope | Effect
   * - | - | -
   * none | | See any document
   *
   * ReadMode on schema is set to 'enlistedInLinkedGroups':
   * Permission | Scope | Effect
   * - | - | -
   * none | `patient enlistment` | See the documents belonging to the group
   * none | `staff enlistment` | See the documents belonging to the group
   * `VIEW_DOCUMENTS` | `global` | See any document
   * @param schemaId The id of the targeted schema.
   * @param rql Add filters to the requested list.
   * @returns {Document} document
   */
  async find<CustomData = null>(
    schemaId: ObjectId,
    options?: OptionsWithRql
  ): Promise<PagedResult<Document<CustomData>>> {
    console.log('options', options);
    return (
      await client.get(
        httpAuth,
        `/${schemaId}/documents${options?.rql || ''}`,
        options?.headers ? { headers: options.headers } : {}
      )
    ).data;
  },

  /**
   * Shortcut method to find a document by id
   * Same Permissions as the find() method
   *
   * @param schemaId the schema Id
   * @param documentId the Id to search for
   * @param rql an optional rql string
   * @returns {Document} document
   */
  async findById<CustomData = null>(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Document<CustomData>> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', documentId).build();
    const res = await this.find(schemaId, { ...options, rql: rqlWithId });

    return res.data[0];
  },

  /**
   * Returns the first document that is found with the applied filter
   * Same Permissions as the find() method
   *
   * @param schemaId the schema Id
   * @param rql an optional rql string
   * @returns {Document} document
   */
  async findFirst<CustomData = null>(
    this: DataDocumentsService,
    schemaId: ObjectId,
    options?: OptionsWithRql
  ): Promise<Document<CustomData>> {
    const res = await this.find(schemaId, options);
    return res.data[0];
  },

  /**
   * Update a document
   * **Partially** update the selected document. Use a `null` value to clear a field.
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
   */
  async update(
    this: DataDocumentsService,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: Record<string, any>,
    options?: OptionsWithRql
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/documents/${documentId}${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Delete a document
   * DeleteMode on schema is set to 'permissionRequired':
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_DOCUMENTS` | `global` | **Required** for this endpoint
   *
   * DeleteMode on schema is set to 'linkedUsersOnly':
   * Permission | Scope | Effect
   * - | - | -
   * none | | Delete the document if the userId is linked to the document
   * none | `staff enlistment`  | Delete the document if the groupId is linked
   * `DELETE_DOCUMENTS` | `global` | Delete the document
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns AffectedRecords
   */
  async remove(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords> {
    return (
      await client.delete(
        httpAuth,
        `/${schemaId}/documents/${documentId}`,
        options
      )
    ).data;
  },

  /**
   * Delete fields from a document
   * Delete the specified fields from the selected document.
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
  async removeFields(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/deleteFields${
          options?.rql || ''
        }`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Transition a document
   * Start a transition manually for the selected document where the conditions of a manual transition are met.
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
  async transition(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      id: ObjectId;
      data?: Record<string, any>;
    },
    options?: OptionsWithRql
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/transition${options?.rql || ''}`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Link groups to a document
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
  async linkGroups(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    },
    options: OptionsBase
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/linkGroups`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Unlink groups from a document
   * Unlink the specified groups from a document.
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
  async unlinkGroups(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    },
    options: OptionsBase
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/unlinkGroups`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Link users to a document
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
  async linkUsers(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    },
    options: OptionsBase
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/linkUsers`,
        requestBody,
        options
      )
    ).data;
  },

  /**
   * Unlink users from a document
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
  async unlinkUsers(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    },
    options: OptionsBase
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/unlinkUsers`,
        requestBody,
        options
      )
    ).data;
  },
});
