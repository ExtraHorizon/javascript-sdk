// method helpers and extensions

import { RQLString, RQLBuilder, rqlBuilder } from '../rql';

/**
 * getRql will construct an rql with the given filters
 * @param eqObj key,value object to filter. for example { id: 'someId', name: 'someName' }
 * @param builder a partial rqlbuilder. For example rqlBuilder().select(['name', 'id'])
 * @returns
 */
export const getRql = (
  eqObj: Record<string, string>,
  builder?: RQLBuilder
): RQLString => {
  const rql = Object.entries(eqObj).reduce(
    (acc: RQLBuilder, [key, value]) => acc.eq(key, value),
    builder || rqlBuilder()
  );
  return rql.build();
};
