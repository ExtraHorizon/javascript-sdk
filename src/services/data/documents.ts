import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { delay } from '../../utils';
import { findAllGenerator, findAllGeneric } from '../helpers';
import { HttpClient } from '../http-client';
import { DataDocumentsService, Document } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataDocumentsService => {
  function partialApplyFind(schemaId) {
    return async options =>
      (
        await client.get(
          httpAuth,
          `/${schemaId}/documents${options?.rql || ''}`,
          options?.headers ? { headers: options.headers } : {}
        )
      ).data;
  }

  return {
    // TypeScript limitation. Function using optional generic with fallback can not be first function.
    async assertNonLockedState(
      schemaId,
      documentId,
      tries = 5,
      retryTimeInMs = 300,
      options
    ) {
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

    async create(schemaId, requestBody, options) {
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

    async find(this: DataDocumentsService, schemaId, options) {
      return partialApplyFind(schemaId)(options);
    },

    async findAll(this: DataDocumentsService, schemaId, options) {
      return findAllGeneric<Document>(partialApplyFind(schemaId), options);
    },

    findAllGenerator(schemaId, options) {
      return findAllGenerator<Document>(partialApplyFind(schemaId), options);
    },

    async findById(this: DataDocumentsService, schemaId, documentId, options?) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', documentId).build();
      const res = await this.find(schemaId, { ...options, rql: rqlWithId });

      return res.data[0];
    },

    async findFirst(this: DataDocumentsService, schemaId, options) {
      const res = await this.find(schemaId, options);
      return res.data[0];
    },

    async update(schemaId, documentId, requestBody, options) {
      return (
        await client.put(
          httpAuth,
          `/${schemaId}/documents/${documentId}${options?.rql || ''}`,
          requestBody,
          options
        )
      ).data;
    },

    async remove(schemaId, documentId, options) {
      return (
        await client.delete(
          httpAuth,
          `/${schemaId}/documents/${documentId}`,
          options
        )
      ).data;
    },

    async removeFields(schemaId, documentId, requestBody, options) {
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

    async transition(schemaId, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaId}/documents/${documentId}/transition${
            options?.rql || ''
          }`,
          requestBody,
          options
        )
      ).data;
    },

    async linkGroups(schemaId, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaId}/documents/${documentId}/linkGroups`,
          requestBody,
          options
        )
      ).data;
    },

    async unlinkGroups(schemaId, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaId}/documents/${documentId}/unlinkGroups`,
          requestBody,
          options
        )
      ).data;
    },

    async linkUsers(schemaId, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaId}/documents/${documentId}/linkUsers`,
          requestBody,
          options
        )
      ).data;
    },

    async unlinkUsers(schemaId, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaId}/documents/${documentId}/unlinkUsers`,
          requestBody,
          options
        )
      ).data;
    },
  };
};
