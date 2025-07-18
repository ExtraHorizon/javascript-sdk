import nock from 'nock';
import {AUTH_BASE, PAYMENTS_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';
import {appStoreSubscription, appStoreSubscriptionProduct,} from '../../__helpers__/payment';
import {createPagedResponse} from '../../__helpers__/utils';

describe('App Store Subscriptions Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const appStoreSubscriptionProductId = appStoreSubscriptionProduct.id;

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

  it('should get a list of App Store subscriptions', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions/')
      .reply(200, createPagedResponse(appStoreSubscription));

    const res = await sdk.payments.appStoreSubscriptions.subscriptions.find();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all App Store subscriptions', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(appStoreSubscription),
      })
      .get('/appStore/subscriptions/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(appStoreSubscription),
      });
    const res =
      await sdk.payments.appStoreSubscriptions.subscriptions.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all App Store subscriptions via iterator', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(appStoreSubscription),
      })
      .get('/appStore/subscriptions/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(appStoreSubscription),
      });
    const subscriptions =
      sdk.payments.appStoreSubscriptions.subscriptions.findAllIterator();

    await subscriptions.next();
    const thirdPage = await subscriptions.next();
    expect(thirdPage.value.data.length).toBe(5);
  });

  it('should get a list of configured App Store subscription products', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions/products/')
      .reply(200, createPagedResponse(appStoreSubscriptionProduct));

    const res = await sdk.payments.appStoreSubscriptions.products.find();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all App Store subscription products', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions/products/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(appStoreSubscriptionProduct),
      })
      .get('/appStore/subscriptions/products/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(appStoreSubscriptionProduct),
      });
    const res = await sdk.payments.appStoreSubscriptions.products.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all App Store subscription products via iterator', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/appStore/subscriptions/products/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(appStoreSubscriptionProduct),
      })
      .get('/appStore/subscriptions/products/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(appStoreSubscriptionProduct),
      });
    const products =
      sdk.payments.appStoreSubscriptions.products.findAllIterator();

    await products.next();
    const thirdPage = await products.next();
    expect(thirdPage.value.data.length).toBe(5);
  });

  it('should create an App Store subscription product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/appStore/subscriptions/products')
      .reply(200, appStoreSubscriptionProduct);

    const subscriptionProduct =
      await sdk.payments.appStoreSubscriptions.products.create({
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

    const res = await sdk.payments.appStoreSubscriptions.products.remove(
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

    const res = await sdk.payments.appStoreSubscriptions.products.update(
      appStoreSubscriptionProductId,
      {
        name: 'FibriCheck Premium Monthly',
      }
    );

    expect(res.affectedRecords).toBe(1);
  });
});
