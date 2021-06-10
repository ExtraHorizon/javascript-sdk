import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import profiles from './profiles';
import groups from './groups';
import logs from './logs';
import medications from './medications';
import health from './health';
import { PROFILES_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';

export type ProfilesService = ReturnType<typeof health> &
  ReturnType<typeof profiles> & {
    groups: ReturnType<typeof groups>;
    logs: ReturnType<typeof logs>;
    medications: ReturnType<typeof medications>;
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
    ...profiles(client, httpWithAuth),
    groups: groups(client, httpWithAuth),
    logs: logs(client, httpWithAuth),
    medications: medications(client, httpWithAuth),
  };
};
