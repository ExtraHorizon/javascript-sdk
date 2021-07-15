import { RQLString, rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import { addPagers } from '../utils';
import { Comment, CommentText, DataCommentsService } from './types';

export default (client, httpAuth: HttpInstance): DataCommentsService => ({
  /**
   * Create a comment
   * Comment on the specified document.
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
  async create(
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    }
  ): Promise<Comment> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents/${documentId}/comments`,
        requestBody
      )
    ).data;
  },

  /**
   * Request a list of comments
   * List the comments for the specified document.
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
  async find(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<Comment>> {
    const result = (
      await client.get(
        httpAuth,
        `/${schemaId}/documents/${documentId}/comments${options?.rql || ''}`
      )
    ).data;
    return addPagers.call(this, [schemaId, documentId], options, result);
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param schemaId the schema Id
   * @param documentId the document Id
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(
    id: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Comment> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find(schemaId, documentId, { rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param schemaId the schema Id
   * @param documentId the document Id
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Comment> {
    const res = await this.find(schemaId, documentId, options);
    return res.data[0];
  },

  /**
   * Update a comment
   * Update a comment you made.
   * Permission | Scope | Effect
   * - | - | -
   * none | | Update your comments
   * `UPDATE_DOCUMENT_COMMENTS` | `global` | Update comments
   * @param commentId The id of the targeted comment.
   * @param schemaId The id of the targeted schema.
   * @param documentId The id of the targeted document.
   * @returns {Promise<AffectedRecords>}
   */

  async update(
    commentId: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId,
    requestBody: {
      text: CommentText;
    }
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/documents/${documentId}/comments/${commentId}`,
        requestBody
      )
    ).data;
  },

  /**
   * Delete a comment
   * Delete a comments from the specified measurement.
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
  async remove(
    commentId: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(
        httpAuth,
        `/${schemaId}/documents/${documentId}/comments/${commentId}`
      )
    ).data;
  },
});
