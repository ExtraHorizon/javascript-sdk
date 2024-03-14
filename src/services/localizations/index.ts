import { LOCALIZATIONS_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import countries from './countries';
import health from './health';
import languages from './languages';
import localizations from './localizations';
import {
  CountriesService,
  LanguagesService,
  LocalizationsService,
} from './types';

export const localizationsService = (
  httpWithAuth: HttpInstance
): ReturnType<typeof health> &
  LocalizationsService &
  CountriesService &
  LanguagesService => {
  const client = httpClient({
    transformRequestData: decamelizeRequestData,
    basePath: LOCALIZATIONS_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...localizations(client, httpWithAuth),
    ...countries(client, httpWithAuth),
    ...languages(client, httpWithAuth),
  };
};
