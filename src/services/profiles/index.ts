import { PROFILES_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import groups from './groups';
import health from './health';
import logs from './logs';
import profiles from './profiles';
import {
  ProfilesGroupsService,
  ProfilesLogsService,
  ProfilesService,
} from './types';

export const profilesService = (
  httpWithAuth: HttpInstance
): ReturnType<typeof health> &
  ProfilesService & {
    groups: ProfilesGroupsService;
    logs: ProfilesLogsService;
  } => {
  const client = httpClient({
    transformRequestData: decamelizeRequestData,
    basePath: PROFILES_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...profiles(client, httpWithAuth),
    groups: groups(client, httpWithAuth),
    logs: logs(client, httpWithAuth),
  };
};
