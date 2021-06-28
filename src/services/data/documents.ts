import { RQLString, rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { delay } from '../../utils';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import { Document } from './types';

export default (client, httpAuth: HttpInstance) => ({
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
    schemaId: ObjectId,
    documentId: ObjectId,
    tries = 5,
    retryTimeInMs = 300
  ): Promise<boolean> {
    if (tries < 1) {
      throw new Error('Document is in a locked state');
    }

    const res = await this.findById(schemaId, documentId);
    if (!res.transitionLock) {
      return true;
    }

    await delay(retryTimeInMs);

    return this.assertNonLockedState(
      schemaId,
      documentId,
      tries - 1,
      retryTimeInMs
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
    requestBody: Record<string, any>
  ): Promise<Document<CustomData>> {
    return (await client.post(httpAuth, `/${schemaId}/documents`, requestBody))
      .data;
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
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<Document<CustomData>>> {
    return (
      await client.get(httpAuth, `/${schemaId}/documents${options?.rql || ''}`)
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
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Document<CustomData>> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', documentId).build();
    const res = await this.find(schemaId, { rql: rqlWithId });

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
    schemaId: ObjectId,
    options?: { rql?: RQLString }
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
   * @returns any Success
   */
  async update(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: Record<string, any>,
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/documents/${documentId}${options?.rql || ''}`,
        requestBody
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
   * @returns any Success
   */
  async delete(
    schemaId: ObjectId,
    documentId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/documents/${documentId}`)
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
   * @param requestBody
   * @returns any Success
   */
  async deleteFields(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      fields: Array<string>;
    },
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/deleteFields${
          options?.rql || ''
        }`,
        requestBody
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
   * @returns any Success
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
    options?: {
      rql?: RQLString;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/transition${options?.rql || ''}`,
        requestBody
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
   * @param requestBody
   * @returns any Success
   */
  async linkGroups(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/linkGroups`,
        requestBody
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
   * @param requestBody
   * @returns any Success
   */
  async unlinkGroups(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      groupIds: Array<ObjectId>;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/unlinkGroups`,
        requestBody
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
   * @param requestBody
   * @returns any Success
   */
  async linkUsers(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/linkUsers`,
        requestBody
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
   * @param requestBody
   * @returns any Success
   */
  async unlinkUsers(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      userIds: Array<ObjectId>;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/unlinkUsers`,
        requestBody
      )
    ).data;
  },
});
