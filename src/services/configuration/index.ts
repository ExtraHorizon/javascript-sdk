import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import general from './general';
import groups from './groups';
import { CONFIGURATION_BASE } from '../../constants';

export * from './types';

export type ConfigurationService = ReturnType<typeof general> &
  ReturnType<typeof groups>;

export const configurationService = (
  httpWithAuth: HttpInstance
): ConfigurationService => {
  const client = httpClient({
    basePath: CONFIGURATION_BASE,
  });

  const generalMethods = general(client, httpWithAuth);
  const groupsMethods = groups(client, httpWithAuth);

  return {
    ...generalMethods,
    ...groupsMethods,
  };
};
