import nock from 'nock';
import { AUTH_BASE, EVENTS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  rqlBuilder,
  ParamsOauth2,
} from '../../../src/index';
import {
  subscriptionsInput,
  subscriptionsData,
  subscriptionsResponse,
} from '../../__helpers__/event';

describe('Subscriptions Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const subscriptionId = subscriptionsData.id;

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

  it('should get a list of subscriptions', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${EVENTS_BASE}`)
      .get(`/${rql}`)
      .reply(200, subscriptionsResponse);

    const res = await sdk.events.subscriptions.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find an subscription by id', async () => {
    nock(`${host}${EVENTS_BASE}`)
      .get(`/?eq(id,${subscriptionId})`)
      .reply(200, subscriptionsResponse);

    const subscription = await sdk.events.subscriptions.findById(
      subscriptionId
    );

    expect(subscription.id).toBe(subscriptionId);
  });

  it('should find the first subscription', async () => {
    nock(`${host}${EVENTS_BASE}`).get('/').reply(200, subscriptionsResponse);

    const subscription = await sdk.events.subscriptions.findFirst();

    expect(subscription.id).toBe(subscriptionId);
  });

  it('should create a new subscription', async () => {
    nock(`${host}${EVENTS_BASE}`).post('/').reply(200, subscriptionsData);

    const subscription = await sdk.events.subscriptions.create(
      subscriptionsInput
    );

    expect(subscription.id).toBe(subscriptionsData.id);
  });
});
