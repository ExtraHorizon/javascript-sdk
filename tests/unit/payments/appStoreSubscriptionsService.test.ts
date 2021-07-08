import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  appStoreSubscription,
  appStoreSubscriptionProduct,
} from '../../__helpers__/payment';
import { createPagedResponse } from '../../__helpers__/utils';

describe('App Store Subscriptions Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const appStoreSubscriptionProductId = appStoreSubscriptionProduct.id;

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

  it('should get a list of App Store subscriptions', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions')
      .reply(200, createPagedResponse(appStoreSubscription));

    const res = await sdk.payments.appStoreSubscriptions.getSubscriptions();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should get a list of configured App Store subscription products', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions/products')
      .reply(200, createPagedResponse(appStoreSubscriptionProduct));

    const res =
      await sdk.payments.appStoreSubscriptions.getSubscriptionsProducts();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should create an App Store subscription product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/appStore/subscriptions/products')
      .reply(200, appStoreSubscriptionProduct);

    const subscriptionProduct =
      await sdk.payments.appStoreSubscriptions.createSubscriptionsProduct({
        name: 'FibriCheck Premium Monthly',
        appStoreAppBundleId: 'com.qompium.fibricheck',
        appStoreProductId: 'fibricheck-premium-monthly',
        subscriptionGroup: 'fibricheck',
        subscriptionTier: 'premium',
      });

    expect(subscriptionProduct.id).toBe(appStoreSubscriptionProductId);
  });

  it('should delete an App Store subscription product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .delete(
        `/appStore/subscriptions/products/${appStoreSubscriptionProductId}`
      )
      .reply(200, {
        affectedRecords: 1,
      });

    const res =
      await sdk.payments.appStoreSubscriptions.removeSubscriptionsProduct(
        appStoreSubscriptionProductId
      );

    expect(res.affectedRecords).toBe(1);
  });

  it('should update an App Store subscription product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .put(`/appStore/subscriptions/products/${appStoreSubscriptionProductId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res =
      await sdk.payments.appStoreSubscriptions.updateSubscriptionsProduct(
        appStoreSubscriptionProductId,
        {
          name: 'FibriCheck Premium Monthly',
        }
      );

    expect(res.affectedRecords).toBe(1);
  });
});
