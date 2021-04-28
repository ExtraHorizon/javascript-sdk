import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructure from './infrastructure';
import schemas from './schemas';
import indexes from './indexes';
import statuses from './statuses';
import properties from './properties';
import { DATA_BASE } from '../../constants';

export type DataService = ReturnType<typeof infrastructure> &
  ReturnType<typeof schemas> &
  ReturnType<typeof indexes> &
  ReturnType<typeof statuses> &
  ReturnType<typeof properties>;

export const dataService = (http: HttpInstance, httpWithAuth: HttpInstance) => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const infrastructureMethods = infrastructure(client, http);
  const schemasMethods = schemas(client, httpWithAuth);
  const indexesMethods = indexes(client, httpWithAuth);
  const statusesMethods = statuses(client, httpWithAuth);
  const propertiesMethods = properties(client, httpWithAuth);

  return {
    ...schemasMethods,
    ...infrastructureMethods,
    ...indexesMethods,
    ...statusesMethods,
    ...propertiesMethods,
  };
};
