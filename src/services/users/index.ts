import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import health from './health';
import users from './users';
import groupRoles from './groupRoles';
import globalRoles from './globalRoles';
import { USER_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';

export * from './types';

export type UsersService = ReturnType<typeof users> &
  ReturnType<typeof health> &
  ReturnType<typeof globalRoles> &
  ReturnType<typeof groupRoles>;

export const usersService = (
  http: HttpInstance,
  httpWithAuth: HttpInstance
): UsersService => {
  const userClient = httpClient({
    basePath: USER_BASE,
    transformRequestData: decamelizeKeys,
  });

  const healthMethods = health(userClient, http);
  const usersMethods = users(userClient, http, httpWithAuth);
  const groupRolesMethods = groupRoles(userClient, httpWithAuth);
  const globalRolesMethods = globalRoles(userClient, httpWithAuth);

  return {
    ...healthMethods,
    ...usersMethods,
    ...groupRolesMethods,
    ...globalRolesMethods,
  };
};
