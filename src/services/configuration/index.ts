import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import general from './general';
import groups from './groups';
import users from './users';
import patientConfiguration from './patientConfiguration';
import staffConfiguration from './staffConfiguration';
import { CONFIGURATION_BASE } from '../../constants';

export * from './types';

export type ConfigurationService = ReturnType<typeof general> &
  ReturnType<typeof groups> &
  ReturnType<typeof users> &
  ReturnType<typeof patientConfiguration> &
  ReturnType<typeof staffConfiguration>;

export const configurationService = (
  httpWithAuth: HttpInstance
): ConfigurationService => {
  const client = httpClient({
    basePath: CONFIGURATION_BASE,
  });

  const generalMethods = general(client, httpWithAuth);
  const groupsMethods = groups(client, httpWithAuth);
  const usersMethods = users(client, httpWithAuth);
  const patientConfigurationMethods = patientConfiguration(
    client,
    httpWithAuth
  );
  const staffConfigurationMethods = staffConfiguration(client, httpWithAuth);

  return {
    ...generalMethods,
    ...groupsMethods,
    ...usersMethods,
    ...patientConfigurationMethods,
    ...staffConfigurationMethods,
  };
};
