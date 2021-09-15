import type { HttpInstance } from '../../types';
import type { Task, TasksService } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (client: HttpClient, httpAuth: HttpInstance): TasksService => {
  async function find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  }
  return {
    async find(options) {
      return await find(options);
    },

    async findAll(options) {
      return findAllGeneric<Task>(find, options);
    },

    findAllIterator(options) {
      return findAllIterator<Task>(find, options);
    },

    async findById(this: TasksService, id, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
      const res = await this.find({ ...options, rql: rqlWithId });
      return res.data[0];
    },

    async findFirst(this: TasksService, options) {
      const res = await this.find(options);
      return res.data[0];
    },

    async create(requestBody, options) {
      return (await client.post(httpAuth, '/', requestBody, options)).data;
    },

    async cancel(taskId, options) {
      return (await client.post(httpAuth, `/${taskId}/cancel`, null, options))
        .data;
    },
  };
};
