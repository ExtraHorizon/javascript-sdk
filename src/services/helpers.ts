// method helpers and extensions

import { RQLString } from '../rql';
import { rqlBuilder } from '../index';

export const withFindMethods = (find: (...any) => Promise<any>) => ({
  /**
   * Find By Id
   * @param id the Id to search for
   * @returns the first element found
   */
  findById: async (id: string, ...args) => {
    const rql = rqlBuilder().eq('id', id).build();
    const res = await find(...args, { rql });
    return res.data[0];
  },

  /**
   * Find By Name
   * @param name the name to search for
   * @returns the first element found
   */
  findByName: async (name: string, ...args) => {
    const rql = rqlBuilder().eq('name', name).build();
    const res = await find(...args, { rql });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql the rql string
   * @returns the first element found
   */
  findFirst: async (options?: { rql?: RQLString }, ...args) => {
    const res = await find(...args, options);
    return res.data[0];
  },
});
