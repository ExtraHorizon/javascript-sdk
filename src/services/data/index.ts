import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructureService from './infrastructureService';
import schemasService from './schemasService';
import indexesService from './indexesService';
import statusesService from './statusesService';
import propertiesService from './propertiesService';
import { DATA_BASE } from '../../constants';
import { TypeConfiguration } from './types';

export type DataService = ReturnType<typeof infrastructureService> &
  ReturnType<typeof schemasService> &
  ReturnType<typeof indexesService> &
  ReturnType<typeof statusesService> &
  ReturnType<typeof propertiesService>;

export default <
  SchemaType,
  SchemaProperties extends Record<keyof SchemaProperties, TypeConfiguration>
>(
  http: HttpInstance,
  httpWithAuth: HttpInstance
) => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const infrastructureMethods = infrastructureService(client, http);
  const schemasMethods = schemasService<SchemaType, SchemaProperties>(
    client,
    httpWithAuth
  );
  const indexesMethods = indexesService(client, httpWithAuth);
  const statusesMethods = statusesService(client, httpWithAuth);
  const propertiesMethods = propertiesService(client, httpWithAuth);

  return {
    ...schemasMethods,
    ...infrastructureMethods,
    ...indexesMethods,
    ...statusesMethods,
    ...propertiesMethods,
  };
};
