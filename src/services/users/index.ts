import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import health from './health';
import users from './users';
import groupRoles from './groupRoles';
import globalRoles from './globalRoles';
import { USER_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';
import {
  UsersGlobalRolesService,
  UsersGroupRolesService,
  UsersService,
} from './types';

export const usersService = (
  httpWithAuth: HttpInstance
): UsersService &
  ReturnType<typeof health> & {
    globalRoles: UsersGlobalRolesService;
    groupRoles: UsersGroupRolesService;
  } => {
  const userClient = httpClient({
    basePath: USER_BASE,
    transformRequestData: decamelizeKeys,
  });

  const healthMethods = health(userClient, httpWithAuth);
  const usersMethods = users(userClient, httpWithAuth);
  const groupRolesMethods = groupRoles(userClient, httpWithAuth);
  const globalRolesMethods = globalRoles(userClient, httpWithAuth);

  return {
    ...healthMethods,
    ...usersMethods,
    groupRoles: groupRolesMethods,
    globalRoles: globalRolesMethods,
  };
};
