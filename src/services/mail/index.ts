import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import mail from './mail';
import { MAIL_BASE } from '../../constants';

export type MailService = ReturnType<typeof mail>;

export const mailService = (httpWithAuth: HttpInstance): MailService => {
  const client = httpClient({
    basePath: MAIL_BASE,
  });

  const mailMethods = mail(client, httpWithAuth);

  return {
    ...mailMethods,
  };
};
