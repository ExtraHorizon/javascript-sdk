import type { HttpInstance } from '../../types';
import type { DispatchersService } from './types';
import { rqlBuilder } from '../../rql';
import { HttpClient } from '../http-client';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DispatchersService => ({
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  },

  async findById(this: DispatchersService, id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  async findFirst(this: DispatchersService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async create(requestBody, options) {
    return (await client.post(httpAuth, '/', requestBody, options)).data;
  },

  /**
   * Delete a dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  async remove(dispatcherId, options) {
    return (await client.delete(httpAuth, `/${dispatcherId}`, options)).data;
  },
});
