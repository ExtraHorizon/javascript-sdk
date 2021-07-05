import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import mails from './mails';
import { MAIL_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';
import { MailsService } from './types';

export const mailsService = (httpWithAuth: HttpInstance): MailsService => {
  const client = httpClient({
    transformRequestData: decamelizeKeys,
    basePath: MAIL_BASE,
  });

  const mailsMethods = mails(client, httpWithAuth);

  return {
    ...mailsMethods,
  };
};
