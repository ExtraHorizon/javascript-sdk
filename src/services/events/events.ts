import type { HttpInstance } from '../../types';
import { PagedResult, ObjectId } from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type { CreateEvent, Event, EventsService } from './types';

export default (client, httpAuth: HttpInstance): EventsService => ({
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Event>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findById(id: ObjectId, options?: { rql?: RQLString }): Promise<Event> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<Event> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: CreateEvent): Promise<Event> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },
});
