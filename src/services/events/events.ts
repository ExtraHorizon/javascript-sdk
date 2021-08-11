import type { HttpInstance } from '../../types';
import { rqlBuilder } from '../../rql';
import type { EventsService } from './types';
import { HttpClient } from '../http-client';

export default (client: HttpClient, httpAuth: HttpInstance): EventsService => ({
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findById(this: EventsService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: EventsService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (await client.post(httpAuth, '/', requestBody, options)).data;
  },
});
