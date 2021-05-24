import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import template from './template';
import { TEMPLATE_BASE } from '../../constants';

export type TemplateService = ReturnType<typeof template>;

export const templateService = (
  httpWithAuth: HttpInstance
): TemplateService => {
  const client = httpClient({
    basePath: TEMPLATE_BASE,
  });

  const templateMethods = template(client, httpWithAuth);

  return {
    ...templateMethods,
  };
};
