import { RQLString, rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import { Comment, CommentText, DataCommentsService } from './types';

export default (client, httpAuth: HttpInstance): DataCommentsService => ({
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

  async find(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: {
      rql?: RQLString;
    }
  ): Promise<PagedResult<Comment>> {
    return (
      await client.get(
        httpAuth,
        `/${schemaId}/documents/${documentId}/comments${options?.rql || ''}`
      )
    ).data;
  },

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

  async findFirst(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Comment> {
    const res = await this.find(schemaId, documentId, options);
    return res.data[0];
  },

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
