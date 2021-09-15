import type { HttpInstance } from '../../types';
import { ResultResponse, Results } from '../types';
import { rqlBuilder } from '../../rql';
import type { TemplateOut, TemplatesService } from './types';
import { HttpClient } from '../http-client';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): TemplatesService => {
  async function find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  }
  return {
    async health() {
      const result: ResultResponse = await client.get(httpAuth, '/health');
      return result.status === Results.Success;
    },

    async findAll(options) {
      return findAllGeneric<TemplateOut>(find, options);
    },

    findAllIterator(options) {
      return findAllIterator<TemplateOut>(find, options);
    },

    find,

    async findById(this: TemplatesService, id, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
      const res = await this.find({ ...options, rql: rqlWithId });
      return res.data[0];
    },

    async findByName(this: TemplatesService, name, options?) {
      const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
      const res = await this.find({ ...options, rql: rqlWithName });
      return res.data[0];
    },

    async findFirst(this: TemplatesService, options) {
      const res = await this.find(options);
      return res.data[0];
    },

    async create(requestBody, options) {
      return (await client.post(httpAuth, '/', requestBody, options)).data;
    },

    async update(templateId, requestBody, options) {
      return (
        await client.put(httpAuth, `/${templateId}`, requestBody, options)
      ).data;
    },

    async remove(templateId, options) {
      return (await client.delete(httpAuth, `/${templateId}`, options)).data;
    },

    async resolveAsPdf(templateId, requestBody, options) {
      return (
        await client.post(httpAuth, `/${templateId}/pdf`, requestBody, {
          ...options,
          responseType: 'arraybuffer',
        })
      ).data;
    },

    async resolveAsPdfUsingCode(
      templateId,
      localizationCode,
      requestBody,
      options
    ) {
      return (
        await client.post(
          httpAuth,
          `/${templateId}/pdf/${localizationCode}`,
          requestBody,
          {
            ...options,
            responseType: 'arraybuffer',
          }
        )
      ).data;
    },

    async resolveAsJson(templateId, requestBody, options) {
      return (
        await client.post(
          httpAuth,
          `/${templateId}/resolve`,
          requestBody,
          options
        )
      ).data;
    },

    async resolveAsJsonUsingCode(
      templateId,
      localizationCode,
      requestBody,
      options
    ) {
      return (
        await client.post(
          httpAuth,
          `/${templateId}/resolve/${localizationCode}`,
          requestBody,
          options
        )
      ).data;
    },
  };
};
