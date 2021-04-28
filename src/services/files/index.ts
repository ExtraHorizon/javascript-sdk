import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import files from './files';
import tokens from './tokens';

import { FILES_BASE } from '../../constants';

export type FilesService = ReturnType<typeof files> & ReturnType<typeof tokens>;

export const filesService = (httpWithAuth: HttpInstance): FilesService => {
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
