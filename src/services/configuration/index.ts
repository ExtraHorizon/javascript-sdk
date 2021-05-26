import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import general from './general';
import groups from './groups';
import users from './users';
import patients from './patients';
import staff from './staff';
import { CONFIGURATION_BASE } from '../../constants';

export type ConfigurationService = ReturnType<typeof general> &
  ReturnType<typeof groups> &
  ReturnType<typeof users> &
  ReturnType<typeof patients> &
  ReturnType<typeof staff>;

export const configurationService = (
  httpWithAuth: HttpInstance
): ConfigurationService => {
  const client = httpClient({
    basePath: CONFIGURATION_BASE,
  });

  const generalMethods = general(client, httpWithAuth);
  const groupsMethods = groups(client, httpWithAuth);
  const usersMethods = users(client, httpWithAuth);
  const patientMethods = patients(client, httpWithAuth);
  const staffMethods = staff(client, httpWithAuth);

  return {
    ...generalMethods,
    ...groupsMethods,
    ...usersMethods,
    ...patientMethods,
    ...staffMethods,
  };
};
