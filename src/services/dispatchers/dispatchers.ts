import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type { Dispatcher } from './types';
import type { RQLString, RQLBuilder } from '../../rql';
import { getRql } from '../helpers';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Request a list of dispatchers
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Dispatcher>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Dispatcher>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @returns the first element found
   */
  async findById(id: ObjectId, builder?: RQLBuilder): Promise<Dispatcher> {
    const rql = getRql({ id }, builder);
    const res = (await client.get(httpAuth, `/${rql}`)).data;
    return res.data[0];
  },

  /**
   * Find First
   * @param name the name to search for
   * @returns the first element found
   */
  async findFirst(rql?: RQLString): Promise<Dispatcher> {
    const res = (await client.get(httpAuth, `/${rql || ''}`)).data;
    return res.data[0];
  },

  /**
   * Create a dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param requestBody Dispatcher
   * @returns Dispatcher
   */
  async create(requestBody: Dispatcher): Promise<Dispatcher> {
    return (await client.post(httpAuth, '/', requestBody)).data;
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
  async remove(dispatcherId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${dispatcherId}`)).data;
  },
});
