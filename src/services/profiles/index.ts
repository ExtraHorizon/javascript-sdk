import { PROFILES_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import groups from './groups';
import logs from './logs';
import profiles from './profiles';
import {
  ProfilesGroupsService,
  ProfilesLogsService,
  ProfilesService,
} from './types';

export const profilesService = (
  httpWithAuth: HttpInstance
): ProfilesService & {
    groups: ProfilesGroupsService;
    logs: ProfilesLogsService;
  } => {
  const client = httpClient({
    transformRequestData: decamelizeRequestData,
    basePath: PROFILES_BASE,
  });

  return {
    ...profiles(client, httpWithAuth),
    groups: groups(client, httpWithAuth),
    logs: logs(client, httpWithAuth),
  };
};
