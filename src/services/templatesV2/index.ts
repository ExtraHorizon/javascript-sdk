import { TEMPLATES_V2_BASE } from '../../constants';
import { decamelizeRequestData } from '../../http/interceptors';
import { AuthHttpClient } from '../../types';
import httpClient from '../http-client';
import health from './health';
import templatesV2 from './templatesV2';
import { TemplatesV2Service } from './types';

export const templatesV2Service = (
  httpWithAuth: AuthHttpClient
): ReturnType<typeof health> & TemplatesV2Service => {
  const client = httpClient({
    basePath: TEMPLATES_V2_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    ...templatesV2(client, httpWithAuth),
  };
};
