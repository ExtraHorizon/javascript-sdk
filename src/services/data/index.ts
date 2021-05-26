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

export type DataService = ReturnType<typeof infrastructure> & {
  schemas: ReturnType<typeof schemas>;
  indexes: ReturnType<typeof indexes>;
  statuses: ReturnType<typeof statuses>;
  properties: ReturnType<typeof properties>;
  comments: ReturnType<typeof comments>;
  documents: ReturnType<typeof documents>;
  transitions: ReturnType<typeof transitions>;
};
export const dataService = (httpWithAuth: HttpInstance): DataService => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  return {
    ...infrastructure(client, httpWithAuth),
    schemas: schemas(client, httpWithAuth),
    indexes: indexes(client, httpWithAuth),
    statuses: statuses(client, httpWithAuth),
    properties: properties(client, httpWithAuth),
    comments: comments(client, httpWithAuth),
    documents: documents(client, httpWithAuth),
    transitions: transitions(client, httpWithAuth),
  };
};
