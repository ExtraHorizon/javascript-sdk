import { LogsService } from './types';
import { HttpInstance } from '../../http/types';
import httpClient from '../http-client';
import { LOGS_BASE } from '../../constants';
import access from './access';

export const logsService = (httpWithAuth: HttpInstance): LogsService => {
  const logsClient = httpClient({
    basePath: LOGS_BASE,
  });

  return {
    access: access(logsClient, httpWithAuth),
  };
};
