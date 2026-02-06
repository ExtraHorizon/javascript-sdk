import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { findAllIterator, findAllGeneric } from '../helpers';
import { HttpClient } from '../http-client';
import { ResultResponse, Results } from '../types';
import type { TemplateOut, TemplatesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): TemplatesService => ({
  async health() {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  async find(options) {
    const result = await client.get(
      httpAuth,
      `/${options?.rql || ''}`,
      {
        ...options,
        customResponseKeys: ['data.schema.fields', 'data.fields'],
      }
    );

    return result.data;
  },

  async findAll(this: TemplatesService, options) {
    return findAllGeneric<TemplateOut>(this.find, options);
  },

  findAllIterator(this: TemplatesService, options) {
    return findAllIterator<TemplateOut>(this.find, options);
  },

  async findById(this: TemplatesService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    return await this.findFirst({ ...options, rql: rqlWithId });
  },

  async findByName(this: TemplatesService, name, options?) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    return await this.findFirst({ ...options, rql: rqlWithName });
  },

  async findFirst(this: TemplatesService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    const result = await client.post(
      httpAuth,
      '/',
      requestBody,
      {
        ...options,
        customKeys: ['schema.fields', 'fields'],
      }
    );
    return result.data;
  },

  async update(templateId, requestBody, options) {
    const result = await client.put(
      httpAuth,
      `/${templateId}`,
      requestBody,
      {
        ...options,
        customKeys: ['schema.fields', 'fields'],
      }
    );
    return result.data;
  },

  async remove(templateId, options) {
    const result = await client.delete(
      httpAuth,
      `/${templateId}`,
      options
    );
    return result.data;
  },

  async resolveAsPdf(templateId, requestBody, options) {
    const result = await client.post(
      httpAuth,
      `/${templateId}/pdf`,
      requestBody,
      {
        ...options,
        customRequestKeys: ['content'],
        responseType: 'arraybuffer',
      }
    );

    return result.data;
  },

  async resolveAsPdfUsingCode(templateId, localizationCode, requestBody, options) {
    const result = await client.post(
      httpAuth,
      `/${templateId}/pdf/${localizationCode}`,
      requestBody,
      {
        ...options,
        customRequestKeys: ['content'],
        responseType: 'arraybuffer',
      }
    );
    return result.data;
  },

  async resolveAsJson(templateId, requestBody, options) {
    const result = await client.post(
      httpAuth,
      `/${templateId}/resolve`,
      requestBody,
      {
        ...options,
        customRequestKeys: ['content'],
        customResponseKeys: ['*'],
      }
    );
    return result.data;
  },

  async resolveAsJsonUsingCode(templateId, localizationCode, requestBody, options) {
    const result = await client.post(
      httpAuth,
      `/${templateId}/resolve/${localizationCode}`,
      requestBody,
      {
        ...options,
        customRequestKeys: ['content'],
        customResponseKeys: ['*'],
      }
    );

    return result.data;
  },
});
