import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import { withFindMethods } from '../helpers';
import mails from './mails';
import { MAIL_BASE } from '../../constants';

export type MailsService = ReturnType<typeof mails> &
  ReturnType<typeof withFindMethods>;

export const mailsService = (httpWithAuth: HttpInstance): MailsService => {
  const client = httpClient({
    basePath: MAIL_BASE,
  });

  const mailsMethods = mails(client, httpWithAuth);
  const mailsFindMethods = withFindMethods(mailsMethods.find);

  return {
    ...mailsMethods,
    ...mailsFindMethods,
  };
};
