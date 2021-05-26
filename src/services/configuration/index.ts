import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import general from './general';
import groups from './groups';
import users from './users';
import patients from './patients';
import staff from './staff';
import { CONFIGURATION_BASE } from '../../constants';

export type ConfigurationService = {
  general: ReturnType<typeof general>;
  groups: ReturnType<typeof groups>;
  users: ReturnType<typeof users>;
  patients: ReturnType<typeof patients>;
  staff: ReturnType<typeof staff>;
};

export const configurationService = (
  httpWithAuth: HttpInstance
): ConfigurationService => {
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
