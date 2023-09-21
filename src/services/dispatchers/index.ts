import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import dispatchers from './dispatchers';
import actions from './actions';
import { DISPATCHERS_BASE } from '../../constants';
import { DispatchersService } from './dispatchers/types';
import { ActionsService } from './actions/types';

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
