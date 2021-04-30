import { RQLString } from '../../rql';
import type { HttpInstance } from '../../types';
import type { ObjectId } from '../models/ObjectId';
import type { AffectedRecords } from '../models/Responses';
import { CommentsList, Comment, CommentText } from './types';

export default (client, httpAuth: HttpInstance) => ({
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
  async createComment(
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
   * @returns {Promise<CommentsList>}
   * @throws {ApiError}
   */
  async findComments(
    schemaId: ObjectId,
    documentId: ObjectId,
    rql?: RQLString
  ): Promise<CommentsList> {
    return (
      await client.get(
        httpAuth,
        `/${schemaId}/documents/${documentId}/comments${rql || ''}`
      )
    ).data;
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
   * @throws {ApiError}
   */

  // TODO swagger must be wrong!! the request body is missing
  async updateComment(
    commentId: ObjectId,
    schemaId: ObjectId,
    documentId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/documents/${documentId}/comments/${commentId}`
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
   * @throws {ApiError}
   */
  async deleteComment(
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
