import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type { Dispatcher, DispatchersService } from './types';
import { RQLString, rqlBuilder } from '../../rql';

export default (client, httpAuth: HttpInstance): DispatchersService => ({
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Dispatcher>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Dispatcher> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },
  async findFirst(options?: { rql?: RQLString }): Promise<Dispatcher> {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody: Dispatcher): Promise<Dispatcher> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  async remove(dispatcherId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${dispatcherId}`)).data;
  },
});
