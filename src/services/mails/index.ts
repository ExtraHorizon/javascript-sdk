import { decamelizeRequestData } from '../../http/interceptors';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import mails from './mails';
import { MAIL_BASE } from '../../constants';
import { MailsService } from './types';

export const mailsService = (httpWithAuth: HttpInstance): MailsService => {
  const client = httpClient({
    transformRequestData: decamelizeRequestData,
    basePath: MAIL_BASE,
  });

  const mailsMethods = mails(client, httpWithAuth);

  return {
    ...mailsMethods,
  };
};
