import type { AffectedRecords, HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructure from './infrastructure';
import schemasService from './schemas';
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
  schemas: (schemaId: any) => {
    document: (documentId: any) => {
      transition: (transitionData: any) => Promise<AffectedRecords>;
    };
  };
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

  const schemas = function (schemaId) {
    return {
      document: documentId => ({
        transition: transitionData =>
          documents.transition(schemaId, documentId, transitionData),
      }),
    };
  };

  Object.assign(schemas, schemasService(client, httpWithAuth));

  return {
    ...infrastructure(client, httpWithAuth),
    schemas,
    indexes: indexes(client, httpWithAuth),
    statuses: statuses(client, httpWithAuth),
    properties: properties(client, httpWithAuth),
    comments: comments(client, httpWithAuth),
    documents,
    transitions: transitions(client, httpWithAuth),
  };
};
