import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import localizations from './localizations';
import { LOCALIZATIONS_BASE } from '../../constants';

export type LocalizationsService = ReturnType<typeof localizations>;

export const localizationsService = (
  httpWithAuth: HttpInstance
): LocalizationsService => {
  const client = httpClient({
    basePath: LOCALIZATIONS_BASE,
  });

  return {
    ...localizations(client, httpWithAuth),
  };
};
