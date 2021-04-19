import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import filesService from './filesService';
import tokensService from './tokensService';

import { FILES_BASE } from '../../constants';

export type FilesService = ReturnType<typeof filesService> &
  ReturnType<typeof tokensService>;

export default (httpWithAuth: HttpInstance): FilesService => {
  const client = httpClient({
    basePath: FILES_BASE,
  });

  const filesMethods = filesService(client, httpWithAuth);
  const tokensMethods = tokensService(client, httpWithAuth);

  return {
    ...filesMethods,
    ...tokensMethods,
  };
};
