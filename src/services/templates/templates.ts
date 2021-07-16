import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  ObjectId,
  PagedResult,
  ResultResponse,
  Results,
} from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  TemplateIn,
  TemplateOut,
  CreateFile,
  TemplatesService,
} from './types';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): TemplatesService => ({
  async health() {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  },

  async findById(id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findByName(name, options?) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ ...options, rql: rqlWithName });
    return res.data[0];
  },

  async findFirst(options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (await client.post(httpAuth, '/', requestBody, options)).data;
  },

  async update(templateId, requestBody, options) {
    return (await client.put(httpAuth, `/${templateId}`, requestBody, options))
      .data;
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
});
