import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import localizations from './localizations';
import health from './health';
import countries from './countries';
import languages from './languages';
import { LOCALIZATIONS_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';
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
    transformRequestData: decamelizeKeys,
    basePath: LOCALIZATIONS_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...localizations(client, httpWithAuth),
    ...countries(client, httpWithAuth),
    ...languages(client, httpWithAuth),
  };
};
