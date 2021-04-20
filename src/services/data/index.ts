import { decamelizeKeys } from 'humps';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructureService from './infrastructureService';
import schemasService from './schemasService';
import { DATA_BASE } from '../../constants';

export type UsersService = ReturnType<typeof infrastructureService> &
  ReturnType<typeof schemasService>;

export default (
  http: HttpInstance,
  httpWithAuth: HttpInstance
): UsersService => {
  const userClient = httpClient({
    basePath: DATA_BASE,
    transformRequestData: decamelizeKeys,
  });

  const infrastructureMethods = infrastructureService(userClient, http);
  const schemasMethods = schemasService(userClient, httpWithAuth);

  return {
    ...infrastructureMethods,
    ...schemasMethods,
  };
};
