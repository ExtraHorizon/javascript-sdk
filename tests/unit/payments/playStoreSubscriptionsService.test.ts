import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  playStoreSubscription,
  playStoreSubscriptionProduct,
} from '../../__helpers__/payment';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Play Store Subscriptions Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const playStoreSubscriptionProductId = playStoreSubscriptionProduct.id;

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

  it('should get a list of Play Store subscriptions', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/subscriptions/')
      .reply(200, createPagedResponse(playStoreSubscription));

    const res = await sdk.payments.playStoreSubscriptions.subscriptions.find();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all Play Store subscriptions', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/subscriptions/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(playStoreSubscription),
      })
      .get('/playStore/subscriptions/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(playStoreSubscription),
      });
    const res =
      await sdk.payments.playStoreSubscriptions.subscriptions.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all Play Store subscriptions via iterator', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/subscriptions/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(playStoreSubscription),
      })
      .get('/playStore/subscriptions/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(playStoreSubscription),
      });
    const subscriptions =
      sdk.payments.playStoreSubscriptions.subscriptions.findAllIterator();

    await subscriptions.next();
    const thirdPage = await subscriptions.next();
    expect(thirdPage.value.data.length).toBe(5);
  });

  it('should get a list of configured Play Store subscription products', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/subscriptions/products/')
      .reply(200, createPagedResponse(playStoreSubscriptionProduct));

    const res = await sdk.payments.playStoreSubscriptions.products.find();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all Play Store subscription products', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/subscriptions/products/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(playStoreSubscriptionProduct),
      })
      .get('/playStore/subscriptions/products/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(playStoreSubscriptionProduct),
      });
    const res = await sdk.payments.playStoreSubscriptions.products.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all Play Store subscription products via iterator', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/playStore/subscriptions/products/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(playStoreSubscriptionProduct),
      })
      .get('/playStore/subscriptions/products/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(playStoreSubscriptionProduct),
      });
    const products =
      sdk.payments.playStoreSubscriptions.products.findAllIterator();

    await products.next();
    const thirdPage = await products.next();
    expect(thirdPage.value.data.length).toBe(5);
  });

  it('should create an Play Store subscription product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/playStore/subscriptions/products')
      .reply(200, playStoreSubscriptionProduct);

    const subscriptionProduct =
      await sdk.payments.playStoreSubscriptions.products.create({
        name: 'FibriCheck Premium Monthly',
        playStorePackageName: 'com.qompium.fibricheck',
        playStoreSubscriptionId: 'fibricheck-premium-monthly',
        subscriptionGroup: 'fibricheck',
        subscriptionTier: 'premium',
      });

    expect(subscriptionProduct.id).toBe(playStoreSubscriptionProductId);
  });

  it('should delete an Play Store subscription product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .delete(
        `/playStore/subscriptions/products/${playStoreSubscriptionProductId}`
      )
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.payments.playStoreSubscriptions.products.remove(
      playStoreSubscriptionProductId
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should update an Play Store subscription product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .put(
        `/playStore/subscriptions/products/${playStoreSubscriptionProductId}`
      )
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.payments.playStoreSubscriptions.products.update(
      playStoreSubscriptionProductId,
      {
        name: 'FibriCheck Premium Monthly',
      }
    );

    expect(res.affectedRecords).toBe(1);
  });
});
