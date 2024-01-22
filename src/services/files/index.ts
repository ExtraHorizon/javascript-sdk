import { FILES_BASE } from '../../constants';
import type {
  FileSettingsService,
  FilesService,
  HttpInstance,
} from '../../types';
import httpClient from '../http-client';
import files from './files';
import settings from './settings';
import tokens from './tokens';
import { FileTokensService } from './types';

export const filesService = (
  httpWithAuth: HttpInstance
): FilesService & FileTokensService & { settings: FileSettingsService; } => {
  const client = httpClient({
    basePath: FILES_BASE,
  });

  const filesMethods = files(client, httpWithAuth);
  const tokensMethods = tokens(client, httpWithAuth);
  const settingsMethods = settings(client, httpWithAuth);

  return {
    ...filesMethods,
    ...tokensMethods,
    settings: settingsMethods,
  };
};
