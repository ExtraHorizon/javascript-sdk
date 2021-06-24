import type { HttpInstance } from '../../types';
import { PagedResult } from '../types';
import { RQLString } from '../../rql';
import type { CreateEvent } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Returns a list of events
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_EVENTS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Event>
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
   * @returns Event
   */
  async create(requestBody: CreateEvent): Promise<Event> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },
});
