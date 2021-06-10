import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import profiles from './profiles';
import groups from './groups';
import health from './health';
import { PROFILES_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';

export type ProfilesService = ReturnType<typeof health> & {
  profiles: ReturnType<typeof profiles>;
  groups: ReturnType<typeof groups>;
};

export const profilesService = (
  httpWithAuth: HttpInstance
): ProfilesService => {
  const client = httpClient({
    transformRequestData: decamelizeKeys,
    basePath: PROFILES_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    profiles: profiles(client, httpWithAuth),
    groups: groups(client, httpWithAuth),
  };
};
