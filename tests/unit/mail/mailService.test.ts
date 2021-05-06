import nock from 'nock';
import { AUTH_BASE, MAIL_BASE } from '../../../src/constants';
import { Client, client, rqlBuilder } from '../../../src/index';
import {
  mailInput,
  mailData,
  mailsResponse,
  queuedMailsResponse,
} from '../../__helpers__/mail';

describe('Mail Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';

  let sdk: Client;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      clientId: '',
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Retrieve a list of mails', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${MAIL_BASE}`).get(`/${rql}`).reply(200, mailsResponse);

    const res = await sdk.mail.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Send a mail', async () => {
    nock(`${apiHost}${MAIL_BASE}`).post('/').reply(200, mailData);

    const mail = await sdk.mail.sendMail(mailInput);

    expect(mail.subject).toBe(mailData.subject);
  });

  it('Register a mail being opened', async () => {
    const trackingHash = 'abcdefg12345';
    nock(`${apiHost}${MAIL_BASE}`).get(`/${trackingHash}/open`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.mail.trackMail(trackingHash);

    expect(res.affectedRecords).toBe(1);
  });

  it('Retrieve the list of mails that are not sent yet', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${MAIL_BASE}`)
      .get(`/queued${rql}`)
      .reply(200, queuedMailsResponse);

    const res = await sdk.mail.findOutboundMails({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });
});
