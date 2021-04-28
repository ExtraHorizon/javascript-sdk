import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import healthService from './healthService';
import usersUsersService from './usersService';
import groupRolesService from './groupRolesService';
import globalRolesService from './globalRolesService';
import { USER_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';

export type UsersService = ReturnType<typeof usersUsersService> &
  ReturnType<typeof healthService> &
  ReturnType<typeof globalRolesService> &
  ReturnType<typeof groupRolesService>;

export const usersService = (
  http: HttpInstance,
  httpWithAuth: HttpInstance
): UsersService => {
  const userClient = httpClient({
    basePath: USER_BASE,
    transformRequestData: decamelizeKeys,
  });

  const healthMethods = healthService(userClient, http);
  const usersMethods = usersUsersService(userClient, http, httpWithAuth);
  const groupRolesMethods = groupRolesService(userClient, httpWithAuth);
  const globalRolesMethods = globalRolesService(userClient, httpWithAuth);

  return {
    ...healthMethods,
    ...usersMethods,
    ...groupRolesMethods,
    ...globalRolesMethods,
  };
};
