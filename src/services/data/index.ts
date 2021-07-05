import type { AffectedRecords, HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructure from './infrastructure';
import schemas from './schemas';
import indexes from './indexes';
import statuses from './statuses';
import properties from './properties';
import comments from './comments';
import documentsService from './documents';
import transitions from './transitions';
import { DATA_BASE } from '../../constants';
import {
  DataCommentsService,
  DataDocumentsService,
  DataIndexesService,
  DataPropertiesService,
  DataSchemasService,
  DataStatusesService,
  DataTransitionsService,
} from './types';

export type DataService = ReturnType<typeof infrastructure> & {
  schema: (schemaId: string) => {
    document: (documentId: string) => {
      transition: (transitionData: any) => Promise<AffectedRecords>;
    };
  };
  schemas: DataSchemasService;
  indexes: DataIndexesService;
  statuses: DataStatusesService;
  properties: DataPropertiesService;
  comments: DataCommentsService;
  documents: DataDocumentsService;
  transitions: DataTransitionsService;
};
export const dataService = (httpWithAuth: HttpInstance): DataService => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const documents = documentsService(client, httpWithAuth);

  // Object.assign(schemas, schemasService(client, httpWithAuth));

  return {
    ...infrastructure(client, httpWithAuth),
    schemas: schemas(client, httpWithAuth),
    indexes: indexes(client, httpWithAuth),
    statuses: statuses(client, httpWithAuth),
    properties: properties(client, httpWithAuth),
    comments: comments(client, httpWithAuth),
    documents,
    schema(schemaId) {
      return {
        document: documentId => ({
          transition: transitionData =>
            documents.transition(schemaId, documentId, transitionData),
        }),
      };
    },
    transitions: transitions(client, httpWithAuth),
  };
};
