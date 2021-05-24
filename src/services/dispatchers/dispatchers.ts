import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
// import type { Task, TaskInput } from './types';
import type { RQLString } from '../../rql';

// FIXME add these types
type Dispatcher = unknown;

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Request a list of dispatchers
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns any Succes
   * @throws ApiError
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Dispatcher>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Create a dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Dispatcher Success
   * @throws ApiError
   */
  async createDispatcher(requestBody: Dispatcher): Promise<Dispatcher> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Delete a dispatcher
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @returns any Operation successful
   * @throws ApiError
   */
  async removeDispatcher(dispatcherId: ObjectId): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${dispatcherId}`)).data;
  },
});
