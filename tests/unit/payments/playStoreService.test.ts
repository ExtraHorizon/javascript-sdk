import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { playStoreDeveloperNotificationMessage } from '../../__helpers__/payment';

describe('Play Store Service', () => {
  const host = 'https://api.xxx.fibricheck.com';

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

  it('should complete a purchase', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/playStore/completePurchase')
      .reply(200, { any: true });

    const res = await sdk.payments.playStore.complete({
      packageName: 'packageName',
      purchaseToken: 'purchaseToken',
      subscriptionId: 'subscriptionId',
    });

    expect(res).toBeDefined();
  });

  it('should processes an Play Store developer notification', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/playStore/processDeveloperNotification')
      .reply(200);

    const done = await sdk.payments.playStore.processDeveloperNotification(
      playStoreDeveloperNotificationMessage
    );

    expect(done).toBe('');
  });
});
