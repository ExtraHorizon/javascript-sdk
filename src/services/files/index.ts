import type { FilesService, HttpInstance } from '../../types';
import { FILES_BASE } from '../../constants';
import httpClient from '../http-client';
import files from './files';
import tokens from './tokens';
import { FileTokensService } from './types';

export const filesService = (
  httpWithAuth: HttpInstance
): FilesService & FileTokensService => {
  const client = httpClient({
    basePath: FILES_BASE,
  });

  const filesMethods = files(client, httpWithAuth);
  const tokensMethods = tokens(client, httpWithAuth);

  return {
    ...filesMethods,
    ...tokensMethods,
  };
};
