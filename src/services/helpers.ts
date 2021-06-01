// method helpers and extensions

import { RQLString } from '../rql';
import { rqlBuilder } from '../index';

export const findById = (find: (any) => Promise<any>) => async (id: string) => {
  const rql = rqlBuilder().eq('id', id).build();
  const res = await find({ rql });
  return res.data[0];
};

export const findByName = (find: (any) => Promise<any>) => async (
  name: string
) => {
  const rql = rqlBuilder().eq('name', name).build();
  const res = await find({ rql });
  return res.data[0];
};

export const findFirst = (find: (any) => Promise<any>) => async (options?: {
  rql?: RQLString;
}) => {
  const res = await find(options);
  return res.data[0];
};
