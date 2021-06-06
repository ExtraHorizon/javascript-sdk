import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import templates from './templates';
import { TEMPLATE_BASE } from '../../constants';

export type TemplatesService = ReturnType<typeof templates>;

export const templatesService = (
  httpWithAuth: HttpInstance
): TemplatesService => {
  const client = httpClient({
    basePath: TEMPLATE_BASE,
  });

  const templatesMethods = templates(client, httpWithAuth);

  return {
    ...templatesMethods,
  };
};
