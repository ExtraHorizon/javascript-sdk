import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import profiles from './profiles';
import health from './health';
import { PROFILES_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';

export type ProfilesService = ReturnType<typeof profiles>;

export const profilesService = (
  httpWithAuth: HttpInstance
): ProfilesService => {
  const client = httpClient({
    transformRequestData: decamelizeKeys,
    basePath: PROFILES_BASE,
  });

  const profilesMethods = profiles(client, httpWithAuth);

  return {
    ...health(client, httpWithAuth),
    ...profilesMethods,
  };
};
