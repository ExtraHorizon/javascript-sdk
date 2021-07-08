import nock from 'nock';
import { AUTH_BASE, MAIL_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  rqlBuilder,
  ParamsOauth2,
} from '../../../src/index';
import { mailInput, mailData, queuedMailData } from '../../__helpers__/mail';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Mail Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const mailId = mailData.id;
  const mailsResponse = createPagedResponse(mailData);
  const queuedMailsResponse = createPagedResponse(queuedMailData);

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should check health', async () => {
    nock(`${host}${MAIL_BASE}`).get('/health').reply(200);

    const endpointIsAvailable = await sdk.mails.health();

    expect(endpointIsAvailable).toBe(true);
  });

  it('should retrieve a list of mails', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${MAIL_BASE}`).get(`/${rql}`).reply(200, mailsResponse);

    const res = await sdk.mails.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a mail by id', async () => {
    nock(`${host}${MAIL_BASE}`)
      .get(`/?eq(id,${mailId})`)
      .reply(200, mailsResponse);

    const mail = await sdk.mails.findById(mailId);

    expect(mail.id).toBe(mailId);
  });

  it('should find the first mail', async () => {
    nock(`${host}${MAIL_BASE}`).get('/').reply(200, mailsResponse);

    const mail = await sdk.mails.findFirst();

    expect(mail.id).toBe(mailId);
  });

  it('should send a mail', async () => {
    nock(`${host}${MAIL_BASE}`).post('/').reply(200, mailData);

    const mail = await sdk.mails.send(mailInput);

    expect(mail.subject).toBe(mailData.subject);
  });

  it('should register a mail being opened', async () => {
    const trackingHash = 'abcdefg12345';
    nock(`${host}${MAIL_BASE}`).get(`/${trackingHash}/open`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.mails.track(trackingHash);

    expect(res.affectedRecords).toBe(1);
  });

  it('should retrieve the list of mails that are not sent yet', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${MAIL_BASE}`)
      .get(`/queued${rql}`)
      .reply(200, queuedMailsResponse);

    const res = await sdk.mails.findOutbound({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });
});
