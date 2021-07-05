import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import general from './general';
import groups from './groups';
import users from './users';
import patients from './patients';
import staff from './staff';
import { CONFIGURATION_BASE } from '../../constants';
import {
  ConfigurationsGeneralService,
  ConfigurationsGroupsService,
  ConfigurationsPatientsService,
  ConfigurationsStaffService,
  ConfigurationsUsersService,
} from './types';

export type ConfigurationsService = {
  general: ConfigurationsGeneralService;
  groups: ConfigurationsGroupsService;
  users: ConfigurationsUsersService;
  patients: ConfigurationsPatientsService;
  staff: ConfigurationsStaffService;
};

export const configurationsService = (
  httpWithAuth: HttpInstance
): ConfigurationsService => {
  const client = httpClient({
    basePath: CONFIGURATION_BASE,
  });

  return {
    general: general(client, httpWithAuth),
    groups: groups(client, httpWithAuth),
    users: users(client, httpWithAuth),
    patients: patients(client, httpWithAuth),
    staff: staff(client, httpWithAuth),
  };
};
