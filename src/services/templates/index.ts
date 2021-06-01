import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import { withFindMethods } from '../helpers';
import templates from './templates';
import { TEMPLATE_BASE } from '../../constants';

export type TemplatesService = ReturnType<typeof templates> &
  ReturnType<typeof withFindMethods>;

export const templatesService = (
  httpWithAuth: HttpInstance
): TemplatesService => {
  const client = httpClient({
    basePath: TEMPLATE_BASE,
  });

  const templatesMethods = templates(client, httpWithAuth);
  const templatesFindMethods = withFindMethods(templatesMethods.find);

  return {
    ...templatesMethods,
    ...templatesFindMethods,
  };
};
