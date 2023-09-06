import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import dispatchers from './dispatchers';
import actions from './actions';
import { DISPATCHERS_BASE } from '../../constants';
import { ActionsService } from './types';
import { DispatchersService } from './dispatchers/types';

export const dispatchersService = (
  httpWithAuth: HttpInstance
): DispatchersService & {
  actions: ActionsService;
} => {
  const client = httpClient({
    basePath: DISPATCHERS_BASE,
  });

  return {
    ...dispatchers(client, httpWithAuth),
    actions: actions(client, httpWithAuth),
  };
};
