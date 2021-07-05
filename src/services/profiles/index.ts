import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import profiles from './profiles';
import groups from './groups';
import logs from './logs';
import health from './health';
import { PROFILES_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';
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
    transformRequestData: decamelizeKeys,
    basePath: PROFILES_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...profiles(client, httpWithAuth),
    groups: groups(client, httpWithAuth),
    logs: logs(client, httpWithAuth),
  };
};
