import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import healthService from './healthService';
import usersService from './usersService';
import groupRolesService from './groupRolesService';
import globalRolesService from './globalRolesService';
import { USER_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';

export type UsersService = ReturnType<typeof usersService> &
  ReturnType<typeof healthService> &
  ReturnType<typeof globalRolesService> &
  ReturnType<typeof groupRolesService>;

export default (
  http: HttpInstance,
  httpWithAuth: HttpInstance
): UsersService => {
  const userClient = httpClient({
    basePath: USER_BASE,
    transformRequestData: decamelizeKeys,
  });

  const healthMethods = healthService(userClient, http);
  const usersMethods = usersService(userClient, http, httpWithAuth);
  const groupRolesMethods = groupRolesService(userClient, httpWithAuth);
  const globalRolesMethods = globalRolesService(userClient, httpWithAuth);

  return {
    ...healthMethods,
    ...usersMethods,
    ...groupRolesMethods,
    ...globalRolesMethods,
  };
};
