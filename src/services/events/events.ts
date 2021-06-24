import type { HttpInstance } from '../../types';
import { PagedResult } from '../types';
import { RQLString } from '../../rql';
import type { CreateEventBean } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Returns a list of events
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_EVENTS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns any Success
   * @throws ApiError
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Event>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Creates an event
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_EVENTS` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns Event Success
   * @throws ApiError
   */
  async create(requestBody: CreateEventBean): Promise<Event> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },
});
