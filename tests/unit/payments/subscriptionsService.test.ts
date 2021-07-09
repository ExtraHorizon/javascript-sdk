import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  subscriptionEventData,
  subscriptionEntitlementData,
} from '../../__helpers__/payment';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Subscriptions Service', () => {
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

  it('should get a list of subscription entitlements', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/entitlements')
      .reply(200, createPagedResponse(subscriptionEntitlementData));

    const res = await sdk.payments.subscriptions.getEntitlements();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should get a list of subscription events', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/subscriptions/events')
      .reply(200, createPagedResponse(subscriptionEventData));

    const res = await sdk.payments.subscriptions.getEvents();

    expect(res.data.length).toBeGreaterThan(0);
  });
});
