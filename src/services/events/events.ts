import type { HttpInstance } from '../../types';
import { rqlBuilder } from '../../rql';
import type { EventsService } from './types';
import { HttpClient } from '../http-client';

export default (client: HttpClient, httpAuth: HttpInstance): EventsService => ({
  /**
   * Returns a list of events
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_EVENTS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Event>
   */
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(id, options) {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ ...options, rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options) {
    const res = await this.find(options);
    return res.data[0];
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
  async create(requestBody, options) {
    return (await client.post(httpAuth, '/', requestBody, options)).data;
  },
});
