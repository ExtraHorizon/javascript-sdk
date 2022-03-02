import type { HttpInstance } from '../../types';
import type { OptionsWithRql, PagedResult } from '../types';
import type { DataSchemasService, Schema } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';
import { addPagersFn, findAllIterator, findAllGeneric } from '../helpers';

const addTransitionHelpersToSchema = (schema: Schema): Schema => ({
  ...schema,
  findTransitionIdByName(name) {
    return (schema.transitions || []).find(
      transition => transition.name === name
    )?.id;
  },
  get transitionsByName() {
    return (schema.transitions || []).reduce(
      (memo, transition) => ({ ...memo, [transition.name]: transition }),
      {}
    );
  },
});

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataSchemasService => {
  async function find(options?: OptionsWithRql) {
    const result: PagedResult<Schema> = (
      await client.get(httpAuth, `/${options?.rql || ''}`, options)
    ).data;
    return {
      ...result,
      data: result.data.map(addTransitionHelpersToSchema),
    };
  }

  return {
    async create(requestBody, options) {
      return addTransitionHelpersToSchema(
        (await client.post(httpAuth, '/', requestBody, options)).data
      );
    },

    async find(options) {
      const result = await find(options);
      return addPagersFn<Schema>(find, options as OptionsWithRql, result);
    },

    async findAll(options) {
      return findAllGeneric<Schema>(find, options as OptionsWithRql);
    },

    findAllIterator(options) {
      return findAllIterator<Schema>(find, options as OptionsWithRql);
    },

    async findById(this: DataSchemasService, id, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
      const res = await find({ ...options, rql: rqlWithId });
      return res.data[0];
    },

    async findByName(this: DataSchemasService, name, options) {
      const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
      const res = await find({ ...options, rql: rqlWithName });
      return res.data[0];
    },

    async findFirst(this: DataSchemasService, options) {
      const res = await find(options);
      return res.data[0];
    },

    async update(schemaId, requestBody, options) {
      return (await client.put(httpAuth, `/${schemaId}`, requestBody, options))
        .data;
    },

    async remove(schemaId, options) {
      return (await client.delete(httpAuth, `/${schemaId}`, options)).data;
    },

    async disable(schemaId, options) {
      return (
        await client.post(httpAuth, `/${schemaId}/disable`, undefined, options)
      ).data;
    },

    async enable(schemaId, options) {
      return (
        await client.post(httpAuth, `/${schemaId}/enable`, undefined, options)
      ).data;
    },
  };
};
