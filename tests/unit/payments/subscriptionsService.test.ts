import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  subscriptionEventData,
  subscriptionEntitlementData,
} from '../../__helpers__/payment';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Subscriptions Service', () => {
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

  it('should get a list of subscription entitlements', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/entitlements/')
      .reply(200, createPagedResponse(subscriptionEntitlementData));

    const res = await sdk.payments.subscriptions.entitlements.find();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all subscription entitlements', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/entitlements/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(subscriptionEntitlementData),
      })
      .get('/subscriptions/entitlements/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(subscriptionEntitlementData),
      });
    const res = await sdk.payments.subscriptions.entitlements.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all subscription entitlements via iterator', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/entitlements/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(subscriptionEntitlementData),
      })
      .get('/subscriptions/entitlements/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(subscriptionEntitlementData),
      });
    const entitlements =
      sdk.payments.subscriptions.entitlements.findAllIterator();

    await entitlements.next();
    const thirdPage = await entitlements.next();
    expect(thirdPage.value.data.length).toBe(5);
  });

  it('should get a list of subscription events', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/events/')
      .reply(200, createPagedResponse(subscriptionEventData));

    const res = await sdk.payments.subscriptions.events.find();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all subscription events', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/events/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(subscriptionEventData),
      })
      .get('/subscriptions/events/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(subscriptionEventData),
      });
    const res = await sdk.payments.subscriptions.events.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all subscription events via iterator', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/events/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(subscriptionEventData),
      })
      .get('/subscriptions/events/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(subscriptionEventData),
      });
    const events = sdk.payments.subscriptions.events.findAllIterator();

    await events.next();
    const thirdPage = await events.next();
    expect(thirdPage.value.data.length).toBe(5);
  });
});
