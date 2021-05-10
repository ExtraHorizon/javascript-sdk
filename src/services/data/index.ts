import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructure from './infrastructure';
import schemas from './schemas';
import indexes from './indexes';
import statuses from './statuses';
import properties from './properties';
import comments from './comments';
import documents from './documents';
import transitions from './transitions';
import { DATA_BASE } from '../../constants';

export type DataService = ReturnType<typeof infrastructure> &
  ReturnType<typeof schemas> &
  ReturnType<typeof indexes> &
  ReturnType<typeof statuses> &
  ReturnType<typeof properties> &
  ReturnType<typeof comments> &
  ReturnType<typeof documents> &
  ReturnType<typeof transitions>;

export const dataService = (httpWithAuth: HttpInstance): DataService => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const infrastructureMethods = infrastructure(client, httpWithAuth);
  const schemasMethods = schemas(client, httpWithAuth);
  const indexesMethods = indexes(client, httpWithAuth);
  const statusesMethods = statuses(client, httpWithAuth);
  const propertiesMethods = properties(client, httpWithAuth);
  const commentsMethods = comments(client, httpWithAuth);
  const documentsMethods = documents(client, httpWithAuth);
  const transitionsMethods = transitions(client, httpWithAuth);

  return {
    ...infrastructureMethods,
    ...schemasMethods,
    ...indexesMethods,
    ...statusesMethods,
    ...propertiesMethods,
    ...commentsMethods,
    ...documentsMethods,
    ...transitionsMethods,
  };
};
