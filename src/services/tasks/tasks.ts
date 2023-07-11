import type { HttpInstance } from '../../types';
import type { Task, TasksService } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';
import { findAllGeneric, findAllIterator } from '../helpers';
import functions from './functions';
import api from './api';
import logs from './logs';
import apiRequests from './apiRequests';
import schedules from './schedules';

export default (client: HttpClient, httpAuth: HttpInstance): TasksService => ({
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
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
    return (await client.post(httpAuth, '/', requestBody, options)).data;
  },

  async cancel(taskId, options) {
    return (await client.post(httpAuth, `/${taskId}/cancel`, {}, options)).data;
  },

  schedules: schedules(client, httpAuth),
  functions: functions(client, httpAuth),
  api: api(client, httpAuth),
  logs: logs(client, httpAuth),
  apiRequests: apiRequests(client, httpAuth),
});
