import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { findAllGeneric, findAllIterator } from '../helpers';
import { HttpClient } from '../http-client';
import type { Task, TasksService } from './types';

export default (client: HttpClient, httpAuth: HttpInstance): TasksService => ({
  async find(options) {
    return (
      await client.get(httpAuth, `/${options?.rql || ''}`, {
        ...options,
        customResponseKeys: ['data.data'],
      })
    ).data;
  },

  async findAll(this: TasksService, options) {
    return findAllGeneric<Task>(this.find, options);
  },

  findAllIterator(this: TasksService, options) {
    return findAllIterator<Task>(this.find, options);
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
    return (
      await client.post(httpAuth, '/', requestBody, {
        ...options,
        customKeys: ['data'],
      })
    ).data;
  },

  async cancel(taskId, options) {
    return (await client.post(httpAuth, `/${taskId}/cancel`, {}, options)).data;
  },
});
