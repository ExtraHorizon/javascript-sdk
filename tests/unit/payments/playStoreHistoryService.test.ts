import nock from 'nock';
import {AUTH_BASE, PAYMENTS_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';
import {
  playStoreDeveloperNotificationSchema,
  playStorePurchaseRecord,
  playStoreSubscriptionPurchaseRecordSchema,
} from '../../__helpers__/payment';
import {createPagedResponse} from '../../__helpers__/utils';

describe('Play Store History Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';

  let sdk: OAuth2Client;

  beforeAll(async () => {
    sdk = createOAuth2Client({
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

  it('should get a list of notifications received from the Play Store', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/history/notifications/')
      .reply(200, createPagedResponse(playStoreDeveloperNotificationSchema));

    const res = await sdk.payments.playStoreHistory.notifications();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should get a list of received Play Store purchase receipts', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/history/purchaseReceipts/')
      .reply(200, createPagedResponse(playStorePurchaseRecord));

    const res = await sdk.payments.playStoreHistory.purchaseReceipts();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should get a list of purchases info (SubscriptionPurchase) received and verified by the Play Store', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/history/purchaseInfos/')
      .reply(
        200,
        createPagedResponse(playStoreSubscriptionPurchaseRecordSchema)
      );

    const res = await sdk.payments.playStoreHistory.purchaseInfos();

    expect(res.data.length).toBeGreaterThan(0);
  });
});
