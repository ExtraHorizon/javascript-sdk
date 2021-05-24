import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import dispatchers from './dispatchers';
import actions from './actions';
import { DISPATCHERS_BASE } from '../../constants';

export * from './types';

export type DispatchersService = ReturnType<typeof dispatchers> &
  ReturnType<typeof actions>;

export const dispatchersService = (
  httpWithAuth: HttpInstance
): DispatchersService => {
  const client = httpClient({
    basePath: DISPATCHERS_BASE,
  });

  const dispatchersMethods = dispatchers(client, httpWithAuth);
  const actionsMethods = actions(client, httpWithAuth);

  return {
    ...dispatchersMethods,
    ...actionsMethods,
  };
};
