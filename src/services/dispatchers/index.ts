import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import { withFindMethods } from '../helpers';
import dispatchers from './dispatchers';
import actions from './actions';
import { DISPATCHERS_BASE } from '../../constants';

export type DispatchersService = ReturnType<typeof dispatchers> &
  ReturnType<typeof withFindMethods> & {
    actions: ReturnType<typeof actions>;
  };

export const dispatchersService = (
  httpWithAuth: HttpInstance
): DispatchersService => {
  const client = httpClient({
    basePath: DISPATCHERS_BASE,
  });

  const dispatchersMethods = dispatchers(client, httpWithAuth);
  const dispatchersFindMethods = withFindMethods(dispatchersMethods.find);

  return {
    ...dispatchersMethods,
    ...dispatchersFindMethods,
    actions: actions(client, httpWithAuth),
  };
};
