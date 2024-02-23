import { USER_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import { activationRequestsService } from './activationRequests';
import { ActivationRequestsService } from './activationRequests/types';
import { forgotPasswordRequestsService } from './forgotPasswordRequests';
import { ForgotPasswordRequestsService } from './forgotPasswordRequests/types';
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
    activationRequests: ActivationRequestsService;
    forgotPasswordRequests: ForgotPasswordRequestsService;
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
  const activationRequestsMethods = activationRequestsService(userClient, httpWithAuth);
  const forgotPasswordRequestsMethods = forgotPasswordRequestsService(userClient, httpWithAuth);
  const settingsMethods = settingsService(userClient, httpWithAuth);

  return {
    ...healthMethods,
    ...usersMethods,
    groupRoles: groupRolesMethods,
    globalRoles: globalRolesMethods,
    activationRequests: activationRequestsMethods,
    forgotPasswordRequests: forgotPasswordRequestsMethods,
    settings: settingsMethods,
  };
};
