import type { HttpInstance } from '../../types';
import type { TasksService } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';

export default (client: HttpClient, httpAuth: HttpInstance): TasksService => ({
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  },

  async findById(id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options) {
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
});
