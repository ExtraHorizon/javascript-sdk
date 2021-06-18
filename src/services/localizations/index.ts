import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import localizations from './localizations';
import health from './health';
import countries from './countries';
import { LOCALIZATIONS_BASE } from '../../constants';

export type LocalizationsService = ReturnType<typeof localizations> &
  ReturnType<typeof health> & {
    countries: ReturnType<typeof countries>;
  };

export const localizationsService = (
  httpWithAuth: HttpInstance
): LocalizationsService => {
  const client = httpClient({
    basePath: LOCALIZATIONS_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...localizations(client, httpWithAuth),
    countries: countries(client, httpWithAuth),
  };
};
