import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import mails from './mails';
import { MAIL_BASE } from '../../constants';
import { decamelizeKeys } from '../../http/utils';

export type MailsService = ReturnType<typeof mails>;

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
