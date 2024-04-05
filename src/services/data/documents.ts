import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { delay } from '../../utils';
import { addPagersFn, findAllIterator, findAllGeneric } from '../helpers';
import { HttpClient } from '../http-client';
import { DataDocumentsService, Document } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataDocumentsService => {
  function partialApplyFind(schemaIdOrName) {
    return async options => {
      const baseConfig = options?.headers ? { headers: options.headers } : {};
      return (
        await client.get(
          httpAuth,
          `/${schemaIdOrName}/documents${options?.rql || ''}`,
          { ...baseConfig, customResponseKeys: ['data.data'] }
        )
      ).data;
    };
  }

  return {
    // TypeScript limitation. Function using optional generic with fallback can not be first function.
    async assertNonLockedState(
      schemaIdOrName,
      documentId,
      tries = 5,
      retryTimeInMs = 300,
      options = {}
    ) {
      if (tries < 1) {
        throw new Error('Document is in a locked state');
      }

      const res = await this.findById(schemaIdOrName, documentId, options);
      if (!res.transitionLock) {
        return true;
      }

      await delay(retryTimeInMs);

      return this.assertNonLockedState(
        schemaIdOrName,
        documentId,
        tries - 1,
        retryTimeInMs,
        options
      );
    },

    async create(schemaIdOrName, requestBody, options) {
      const baseConfig = options?.headers ? { headers: options.headers } : {};
      return (
        await client.post(
          httpAuth,
          `/${schemaIdOrName}/documents`,
          requestBody,
          {
            ...baseConfig,
            customResponseKeys: ['data'],
          },
          options
        )
      ).data;
    },

    async find(schemaIdOrName, options) {
      const result = await partialApplyFind(schemaIdOrName)(options);
      return addPagersFn<Document>(partialApplyFind(schemaIdOrName), options, result);
    },

    async findAll(this: DataDocumentsService, schemaIdOrName, options) {
      return findAllGeneric<Document>(partialApplyFind(schemaIdOrName), options);
    },

    findAllIterator(schemaIdOrName, options) {
      return findAllIterator<Document>(partialApplyFind(schemaIdOrName), options);
    },

    async findById(this: DataDocumentsService, schemaIdOrName, documentId, options?) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', documentId).build();
      const res = await this.find(schemaIdOrName, { ...options, rql: rqlWithId });

      return res.data[0];
    },

    async findFirst(this: DataDocumentsService, schemaIdOrName, options) {
      const res = await this.find(schemaIdOrName, options);
      return res.data[0];
    },

    async update(schemaIdOrName, documentId, requestBody, options) {
      return (
        await client.put(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}${options?.rql || ''}`,
          requestBody,
          options
        )
      ).data;
    },

    async remove(schemaIdOrName, documentId, options) {
      return (
        await client.delete(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}`,
          options
        )
      ).data;
    },

    async removeFields(schemaIdOrName, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}/deleteFields${
            options?.rql || ''
          }`,
          requestBody,
          options
        )
      ).data;
    },

    async transition(schemaIdOrName, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}/transition${
            options?.rql || ''
          }`,
          requestBody,
          options
        )
      ).data;
    },

    async linkGroups(schemaIdOrName, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}/linkGroups`,
          requestBody,
          options
        )
      ).data;
    },

    async unlinkGroups(schemaIdOrName, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}/unlinkGroups`,
          requestBody,
          options
        )
      ).data;
    },

    async linkUsers(schemaIdOrName, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}/linkUsers`,
          requestBody,
          options
        )
      ).data;
    },

    async unlinkUsers(schemaIdOrName, documentId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${schemaIdOrName}/documents/${documentId}/unlinkUsers`,
          requestBody,
          options
        )
      ).data;
    },
  };
};
