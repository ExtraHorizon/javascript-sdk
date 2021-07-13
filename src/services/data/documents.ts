import { RQLString, rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { delay } from '../../utils';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import { DataDocumentsService, Document } from './types';

export default (client, httpAuth: HttpInstance): DataDocumentsService => ({
  // TypeScript limitation. Function using optional generic with fallback can not be first function.
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

  async create<CustomData = null>(
    schemaId: ObjectId,
    requestBody: Record<string, any>,
    options?: { gzip?: boolean }
  ): Promise<Document<CustomData>> {
    return (
      await client.post(
        httpAuth,
        `/${schemaId}/documents`,
        requestBody,
        {},
        options
      )
    ).data;
  },

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

  async findById<CustomData = null>(
    schemaId: ObjectId,
    documentId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Document<CustomData>> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', documentId).build();
    const res = await this.find(schemaId, { rql: rqlWithId });

    return res.data[0];
  },

  async findFirst<CustomData = null>(
    schemaId: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Document<CustomData>> {
    const res = await this.find(schemaId, options);
    return res.data[0];
  },

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

  async remove(
    schemaId: ObjectId,
    documentId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/documents/${documentId}`)
    ).data;
  },

  async removeFields(
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
