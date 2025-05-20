import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  appleReceipt,
  appleNotification,
  appStoreNotification,
  appStoreReceipt,
  appStoreSharedSecret,
  appStoreSharedSecretCreation,
} from '../../__helpers__/payment';
import { createPagedResponse } from '../../__helpers__/utils';

describe('App Store Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';

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

  it('should complete a transaction', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/appStore/completeTransaction')
      .reply(200, appleReceipt);

    const res = await sdk.payments.appStore.completeTransaction({
      receiptData:
        'ITqTCCE6UCAQExCzAJBgUrDgMCGgUAMIIDWQYJKoZIhvcNAQcBoIIDSgSCA0YxggNCM...',
      transactionId: '1000000472106082',
    });

    expect(res.status).toBeDefined();
  });

  it('Completes a transaction for a user and application', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/appStore/completeTransaction')
      .reply(200, appleReceipt);

    const response = await sdk.payments.appStore.completeTransaction({
      receiptData:
        'ITqTCCE6UCAQExCzAJBgUrDgMCGgUAMIIDWQYJKoZIhvcNAQcBoIIDSgSCA0YxggNCM...',
      transactionId: '1000000472106082',
      userId: '682c8995fdc6f490c2fe17fd',
      applicationId: '682c899a607f05f75053805f',
    });

    expect(response.status).toBeDefined();
  });

  it('should verify the receipt of a transaction', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/appStore/verifyReceipt')
      .reply(200, appleReceipt);

    const res = await sdk.payments.appStore.verifyTransaction({
      receiptData:
        'ITqTCCE6UCAQExCzAJBgUrDgMCGgUAMIIDWQYJKoZIhvcNAQcBoIIDSgSCA0YxggNCM...',
    });

    expect(res.status).toBeDefined();
  });

  it('should processes an App Store server notification', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/appStore/processServerNotification')
      .reply(200);

    const done = await sdk.payments.appStore.processNotification(
      appleNotification
    );

    expect(done).toBe(true);
  });

  it('should get a list of notifications received from the App Store', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/receivedNotifications/')
      .reply(200, createPagedResponse(appStoreNotification));

    const res = await sdk.payments.appStore.getNotifications();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should get a list of receipts received and verified by the App Store', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/receivedReceipts/')
      .reply(200, createPagedResponse(appStoreReceipt));

    const res = await sdk.payments.appStore.getReceipts();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should get a list of shared secrets with App Store', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/sharedSecrets/')
      .reply(200, createPagedResponse(appStoreSharedSecret));

    const res = await sdk.payments.appStore.getSharedSecrets();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should create a shared secret with App Store', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/appStore/sharedSecrets')
      .reply(200, appStoreSharedSecret);

    const res = await sdk.payments.appStore.createSharedSecret(
      appStoreSharedSecretCreation
    );

    expect(res.id).toBeDefined();
  });

  it('should remove a shared secret with App Store', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .delete('/appStore/sharedSecrets/sharedsecretid')
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.payments.appStore.removeSharedSecret(
      'sharedsecretid'
    );

    expect(res.affectedRecords).toBe(1);
  });
});
