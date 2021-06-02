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
  /**
   * A schema defines both the data contained and the behavior (in the form of a state machine) of the documents it holds.
   * @see https://developers.extrahorizon.io/services/data-service/1.0.9/schemas.html
   */
  schemas: ReturnType<typeof schemas>;
  indexes: ReturnType<typeof indexes>;
  statuses: ReturnType<typeof statuses>;
  properties: ReturnType<typeof properties>;
  comments: ReturnType<typeof comments>;
  /**
   * A document is an instance of such a "structured data". Each schema is separated from other schemas and their documents.
   */
  documents: ReturnType<typeof documents>;
  /**
   * Transitions determine the possible ways the status of a document can change from one value (a value in the fromStatuses field) to another (the value of the toStatus field).
   */
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
