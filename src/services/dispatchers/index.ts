import { DISPATCHERS_BASE } from '../../constants';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import actions from './actions';
import { ActionsService } from './actions/types';
import dispatchers from './dispatchers';
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
