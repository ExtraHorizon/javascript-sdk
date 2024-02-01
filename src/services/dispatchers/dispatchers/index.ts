import { HttpInstance } from '../../../http/types';
import { rqlBuilder } from '../../../rql';
import { findAllGeneric, findAllIterator } from '../../helpers';
import { HttpClient } from '../../http-client';
import { OptionsWithRql } from '../../types';
import { Dispatcher, DispatchersService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DispatchersService => {
  async function query(options: OptionsWithRql) {
    const { data } = await client.get(httpAuth, `/${options?.rql || ''}`, {
      ...options,
      customResponseKeys: ['data.actions.data'],
    });

    return data;
  }

  return {
    async create(requestBody, options) {
      const { data } = await client.post(httpAuth, '/', requestBody, {
        ...options,
        customResponseKeys: ['actions.data'],
      });

      return data;
    },

    async update(dispatcherId, requestBody, options) {
      const { data } = await client.put(
        httpAuth,
        `/${dispatcherId}`,
        requestBody,
        options
      );

      return data;
    },

    async find(options) {
      return await query(options);
    },

    async findAll(this: DispatchersService, options) {
      return findAllGeneric<Dispatcher>(query, options);
    },

    findAllIterator(this: DispatchersService, options) {
      return findAllIterator<Dispatcher>(query, options);
    },

    async findFirst(options) {
      const { data } = await query(options);

      return data[0];
    },

    async findById(id, options) {
      const rql = rqlBuilder().eq('id', id).build();
      const { data } = await query({ ...options, rql });

      return data[0];
    },

    async remove(dispatcherId, options) {
      const { data } = await client.delete(
        httpAuth,
        `/${dispatcherId}`,
        options
      );

      return data;
    },
  };
};
