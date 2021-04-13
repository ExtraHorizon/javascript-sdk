import { decamelizeKeys } from 'humps';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import healthService from './healthService';
import usersService from './usersService';
import groupRolesService from './groupRolesService';

export type UsersService = ReturnType<typeof usersService> &
  ReturnType<typeof healthService> &
  ReturnType<typeof groupRolesService>;

export default (
  http: HttpInstance,
  httpWithAuth: HttpInstance
): UsersService => {
  const userClient = httpClient({
    basePath: '/users/v1',
    transformRequestData: decamelizeKeys,
  });

  const healthMethods = healthService(userClient, http);
  const usersMethods = usersService(userClient, http, httpWithAuth);
  const groupRolesMethods = groupRolesService(userClient, http, httpWithAuth);

  return {
    ...healthMethods,
    ...usersMethods,
    ...groupRolesMethods,
  };
};
