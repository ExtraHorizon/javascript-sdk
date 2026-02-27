import { TEMPLATES_V2_BASE } from '../../constants';
import { AuthHttpClient } from '../../types';
import httpClient from '../http-client';
import templatesV2 from './templatesV2';
import { TemplatesV2Service } from './types';

export const templatesV2Service = (
  httpWithAuth: AuthHttpClient
): TemplatesV2Service => {
  const client = httpClient({
    basePath: TEMPLATES_V2_BASE,
  });

  return {
    ...templatesV2(client, httpWithAuth),
  };
};
