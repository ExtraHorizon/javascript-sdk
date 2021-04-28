import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import filesFilesService from './filesService';
import tokensService from './tokensService';

import { FILES_BASE } from '../../constants';

export type FilesService = ReturnType<typeof filesFilesService> &
  ReturnType<typeof tokensService>;

export const filesService = (httpWithAuth: HttpInstance): FilesService => {
  const client = httpClient({
    basePath: FILES_BASE,
  });

  const filesMethods = filesFilesService(client, httpWithAuth);
  const tokensMethods = tokensService(client, httpWithAuth);

  return {
    ...filesMethods,
    ...tokensMethods,
  };
};
