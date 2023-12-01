import { LOGS_BASE } from '../../constants';
import { HttpInstance } from '../../http/types';
import httpClient from '../http-client';
import access from './access';
import { LogsService } from './types';

export const logsService = (httpWithAuth: HttpInstance): LogsService => {
  const logsClient = httpClient({
    basePath: LOGS_BASE,
  });

  return {
    access: access(logsClient, httpWithAuth),
  };
};
