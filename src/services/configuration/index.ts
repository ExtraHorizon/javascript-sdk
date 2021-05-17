import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import general from './general';
import { CONFIGURATION_BASE } from '../../constants';

export * from './types';

export type ConfigurationService = ReturnType<typeof general>;

export const configurationService = (
  httpWithAuth: HttpInstance
): ConfigurationService => {
  const client = httpClient({
    basePath: CONFIGURATION_BASE,
  });

  const generalMethods = general(client, httpWithAuth);

  return {
    ...generalMethods,
  };
};
