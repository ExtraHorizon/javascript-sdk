import { findAllGeneric, findAllIterator } from '../../helpers';
import { HttpClient } from '../../http-client';
import { Dispatcher, DispatchersService } from './types';
import { HttpInstance } from '../../../http/types';
import { OptionsWithRql } from '../../types';
import { rqlBuilder } from '../../../rql';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DispatchersService => {
  async function query(options: OptionsWithRql) {
    const { data } = await client.get(
      httpAuth,
      `/${options?.rql || ''}`,
      options
    );

    return data;
  }

  return {
    async create(requestBody, options) {
      const { data } = await client.post(httpAuth, '/', requestBody, options);

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
      return findAllGeneric<Dispatcher>(this.find, options);
    },

    findAllIterator(this: DispatchersService, options) {
      return findAllIterator<Dispatcher>(this.find, options);
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
