import { decamelizeKeys } from 'humps';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructureService from './infrastructureService';
import { DATA_BASE } from '../../constants';

export type UsersService = ReturnType<typeof infrastructureService>;

export default (
  http: HttpInstance
  // httpWithAuth: HttpInstance
): UsersService => {
  const userClient = httpClient({
    basePath: DATA_BASE,
    transformRequestData: decamelizeKeys,
  });

  const infrastructureMethods = infrastructureService(userClient, http);

  return {
    ...infrastructureMethods,
  };
};
