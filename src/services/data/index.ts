import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructureService from './infrastructureService';
import schemasService from './schemasService';
import { DATA_BASE } from '../../constants';

export type DataService = ReturnType<typeof infrastructureService> &
  ReturnType<typeof schemasService>;

export default (
  http: HttpInstance,
  httpWithAuth: HttpInstance
): DataService => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const infrastructureMethods = infrastructureService(client, http);
  const schemasMethods = schemasService(client, httpWithAuth);

  return {
    ...infrastructureMethods,
    ...schemasMethods,
  };
};
