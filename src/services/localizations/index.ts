import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import localizations from './localizations';
import health from './health';
import countries from './countries';
import languages from './languages';
import { LOCALIZATIONS_BASE } from '../../constants';

export type LocalizationsService = ReturnType<typeof health> &
  ReturnType<typeof localizations> &
  ReturnType<typeof countries> &
  ReturnType<typeof languages>;

export const localizationsService = (
  httpWithAuth: HttpInstance
): LocalizationsService => {
  const client = httpClient({
    basePath: LOCALIZATIONS_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...localizations(client, httpWithAuth),
    ...countries(client, httpWithAuth),
    ...languages(client, httpWithAuth),
  };
};
