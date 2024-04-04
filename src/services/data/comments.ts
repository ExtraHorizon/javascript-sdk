import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import { DataCommentsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataCommentsService => ({
  async create(schemaIdOrName, documentId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/${schemaIdOrName}/documents/${documentId}/comments`,
        requestBody,
        options
      )
    ).data;
  },

  async find(schemaIdOrName, documentId, options) {
    return (
      await client.get(
        httpAuth,
        `/${schemaIdOrName}/documents/${documentId}/comments${options?.rql || ''}`,
        options
      )
    ).data;
  },

  async findById(this: DataCommentsService, id, schemaIdOrName, documentId, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find(schemaIdOrName, documentId, {
      ...options,
      rql: rqlWithId,
    });
    return res.data[0];
  },

  async findFirst(this: DataCommentsService, schemaIdOrName, documentId, options) {
    const res = await this.find(schemaIdOrName, documentId, options);
    return res.data[0];
  },

  async update(commentId, schemaIdOrName, documentId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/${schemaIdOrName}/documents/${documentId}/comments/${commentId}`,
        requestBody,
        options
      )
    ).data;
  },

  async remove(commentId, schemaIdOrName, documentId, options) {
    return (
      await client.delete(
        httpAuth,
        `/${schemaIdOrName}/documents/${documentId}/comments/${commentId}`,
        options
      )
    ).data;
  },
});
