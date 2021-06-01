import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import { withFindMethods } from '../helpers';
import infrastructure from './infrastructure';
import schemas from './schemas';
import indexes from './indexes';
import statuses from './statuses';
import properties from './properties';
import comments from './comments';
import documents from './documents';
import transitions from './transitions';
import { DATA_BASE } from '../../constants';

export type DataService = ReturnType<typeof infrastructure> & {
  schemas: ReturnType<typeof schemas> & ReturnType<typeof withFindMethods>;
  indexes: ReturnType<typeof indexes>;
  statuses: ReturnType<typeof statuses>;
  properties: ReturnType<typeof properties>;
  comments: ReturnType<typeof comments> & ReturnType<typeof withFindMethods>;
  documents: ReturnType<typeof documents> & ReturnType<typeof withFindMethods>;
  transitions: ReturnType<typeof transitions>;
};
export const dataService = (httpWithAuth: HttpInstance): DataService => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const schemasMethods = schemas(client, httpWithAuth);
  const schemasFindMethods = withFindMethods(schemasMethods.find);

  const commentsMethods = comments(client, httpWithAuth);
  const commentsFindMethods = withFindMethods(commentsMethods.find);

  const documentsMethods = documents(client, httpWithAuth);
  const documentsFindMethods = withFindMethods(documentsMethods.find);

  return {
    ...infrastructure(client, httpWithAuth),
    schemas: { ...schemasMethods, ...schemasFindMethods },
    indexes: indexes(client, httpWithAuth),
    statuses: statuses(client, httpWithAuth),
    properties: properties(client, httpWithAuth),
    comments: { ...commentsMethods, ...commentsFindMethods },
    documents: { ...documentsMethods, ...documentsFindMethods },
    transitions: transitions(client, httpWithAuth),
  };
};
