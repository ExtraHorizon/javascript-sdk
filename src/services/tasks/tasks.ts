import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type { Task, TaskInput, TasksService } from './types';
import { RQLString, rqlBuilder } from '../../rql';

export default (client, httpAuth: HttpInstance): TasksService => ({
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Task>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findById(id: ObjectId, options?: { rql?: RQLString }): Promise<Task> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Task> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: TaskInput): Promise<Task> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  async cancel(taskId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${taskId}/cancel`)).data;
  },
});
