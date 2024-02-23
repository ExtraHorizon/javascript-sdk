import { USER_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import globalRoles from './globalRoles';
import groupRoles from './groupRoles';
import health from './health';
import { settingsService } from './settings';
import { SettingsService } from './settings/types';
import { UsersGlobalRolesService, UsersGroupRolesService } from './types';
import users from './users';

export const usersService = (
  httpWithAuth: HttpInstance,
  http: HttpInstance
): ReturnType<typeof users> &
  ReturnType<typeof health> & {
    globalRoles: UsersGlobalRolesService;
    groupRoles: UsersGroupRolesService;
    settings: SettingsService;
  } => {
  const userClient = httpClient({
    basePath: USER_BASE,
    transformRequestData: decamelizeRequestData,
  });

  const healthMethods = health(userClient, httpWithAuth);
  const usersMethods = users(userClient, httpWithAuth, http);
  const groupRolesMethods = groupRoles(userClient, httpWithAuth);
  const globalRolesMethods = globalRoles(userClient, httpWithAuth);
  const settingsMethods = settingsService(userClient, httpWithAuth);

  return {
    ...healthMethods,
    ...usersMethods,
    groupRoles: groupRolesMethods,
    globalRoles: globalRolesMethods,
    settings: settingsMethods,
  };
};
