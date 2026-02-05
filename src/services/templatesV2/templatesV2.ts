import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { findAllIterator, findAllGeneric } from '../helpers';
import { HttpClient } from '../http-client';
import { TemplateV2Out, TemplatesV2Service } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): TemplatesV2Service => ({
  async find(options) {
    return (
      await client.get(httpAuth, `/${options?.rql || ''}`, {
        ...options,
        customResponseKeys: ['data.properties'],
      })
    ).data;
  },

  async findAll(this: TemplatesV2Service, options) {
    return findAllGeneric<TemplateV2Out>(this.find, options);
  },

  findAllIterator(this: TemplatesV2Service, options) {
    return findAllIterator<TemplateV2Out>(this.find, options);
  },

  async findById(this: TemplatesV2Service, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findByName(this: TemplatesV2Service, name, options?) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ ...options, rql: rqlWithName });
    return res.data[0];
  },

  async findFirst(this: TemplatesV2Service, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (
      await client.post(httpAuth, '/', requestBody, {
        ...options,
        customKeys: ['properties'],
      })
    ).data;
  },

  async update(templateId, requestBody, options) {
    return (
      await client.put(httpAuth, `/${templateId}`, requestBody, {
        ...options,
        customKeys: ['properties'],
      })
    ).data;
  },

  async remove(templateId, options) {
    return (await client.delete(httpAuth, `/${templateId}`, options)).data;
  },

  async resolve(templateId, requestBody, options) {
    return (
      await client.post(httpAuth, `/${templateId}/resolve`, requestBody, {
        ...options,
        customRequestKeys: ['data'],
        customResponseKeys: ['*'],
      })
    ).data;
  },
});
