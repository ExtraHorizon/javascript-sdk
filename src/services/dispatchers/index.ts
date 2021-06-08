import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import dispatchers from './dispatchers';
import actions from './actions';
import { DISPATCHERS_BASE } from '../../constants';

export type DispatchersService = ReturnType<typeof dispatchers> & {
  actions: ReturnType<typeof actions>;
};

export const dispatchersService = (
  httpWithAuth: HttpInstance
): DispatchersService => {
  const client = httpClient({
    basePath: DISPATCHERS_BASE,
  });

  return {
    ...dispatchers(client, httpWithAuth),
    actions: actions(client, httpWithAuth),
  };
};
