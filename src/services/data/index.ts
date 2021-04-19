import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import infrastructureService from './infrastructureService';
import { DATA_BASE } from '../../constants';

export type InfrastructureService = ReturnType<typeof infrastructureService>;

export default (http: HttpInstance): InfrastructureService => {
  const client = httpClient({
    basePath: DATA_BASE,
  });

  const infrastructureMethods = infrastructureService(client, http);

  return {
    ...infrastructureMethods,
  };
};
