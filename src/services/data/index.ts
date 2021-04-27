import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructureService from './infrastructureService';
import schemasService from './schemasService';
import indexesService from './indexesService';
import statusesService from './statusesService';
import propertiesService from './propertiesService';
import { DATA_BASE } from '../../constants';

export type DataService = ReturnType<typeof infrastructureService> &
  ReturnType<typeof schemasService> &
  ReturnType<typeof indexesService> &
  ReturnType<typeof statusesService> &
  ReturnType<typeof propertiesService>;

export default (
  http: HttpInstance,
  httpWithAuth: HttpInstance
): DataService => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const infrastructureMethods = infrastructureService(client, http);
  const schemasMethods = schemasService(client, httpWithAuth);
  const indexesMethods = indexesService(client, httpWithAuth);
  const statusesMethods = statusesService(client, httpWithAuth);
  const propertiesMethods = propertiesService(client, httpWithAuth);

  return {
    ...infrastructureMethods,
    ...schemasMethods,
    ...indexesMethods,
    ...statusesMethods,
    ...propertiesMethods,
  };
};
