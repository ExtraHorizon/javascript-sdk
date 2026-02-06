import { rqlBuilder } from '../../rql';
import { AuthHttpClient } from '../../types';
import { findAllGeneric, addPagersFn } from '../helpers';
import { HttpClient } from '../http-client';
import { TemplateV2, TemplatesV2Service } from './types';

export default (
  client: HttpClient,
  httpWithAuth: AuthHttpClient
): TemplatesV2Service => {
  async function find(options) {
    const result = await client.get(
      httpWithAuth,
      `/${options?.rql || ''}`,
      {
        ...options,
        customResponseKeys: ['data.properties', 'data.outputs'],
      }
    );

    return result.data;
  }

  return {
    async create(requestBody, options) {
      const result = (
        await client.post(
          httpWithAuth,
          '/',
          requestBody,
          {
            ...options,
            customKeys: ['properties', 'outputs'],
          }
        )
      );

      return result.data;
    },

    async update(templateId, requestBody, options) {
      const result = (
        await client.put(
          httpWithAuth,
          `/${templateId}`,
          requestBody,
          {
            ...options,
            customKeys: ['properties', 'outputs'],
          }
        )
      );

      return result.data;
    },

    async remove(templateId, options) {
      const result = (
        await client.delete(
          httpWithAuth,
          `/${templateId}`,
          options
        )
      );

      return result.data;
    },

    async resolve(templateId, requestBody, options) {
      const result = (
        await client.post(
          httpWithAuth,
          `/${templateId}/resolve`,
          requestBody,
          {
            ...options,
            customRequestKeys: ['data'],
            customResponseKeys: ['*'],
          }
        )
      );

      return result.data;
    },

    async find(options) {
      const result = await find(options);
      return addPagersFn<TemplateV2>(find, options, result);
    },

    async findAll(options) {
      return findAllGeneric<TemplateV2>(find, options);
    },

    async findById(templateId, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', templateId).build();
      const result = await find({ ...options, rql: rqlWithId });
      return result.data[0];
    },

    async findByName(name, options?) {
      const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
      const result = await find({ ...options, rql: rqlWithName });
      return result.data[0];
    },

    async findFirst(options) {
      const result = await find(options);
      return result.data[0];
    },
  };
};
