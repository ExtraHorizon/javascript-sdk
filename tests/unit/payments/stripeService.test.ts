import nock from 'nock';
import {AUTH_BASE, PAYMENTS_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';
import {PaymentIntentCreationSchemaSetupPaymentMethodReuse} from '../../../src/services/payments/types';
import {orderData, paymentIntent, stripePaymentMethod, stripeUser,} from '../../__helpers__/payment';

describe('Stripe Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const userId = '507f191e810c19729de860ea';
  const paymentMethodId = stripePaymentMethod.id;
  const orderId = orderData.id;

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

  it('should get the saved Stripe data for a user', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get(`/stripe/users/${userId}`)
      .reply(200, stripeUser);

    const user = await sdk.payments.stripe.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should save a payment method to a Stripe user', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post(`/stripe/users/${userId}/paymentMethods`)
      .reply(200, stripePaymentMethod);

    const paymentMethod = await sdk.payments.stripe.savePaymentMethod(userId, {
      stripeId: 'pm_1FOjoNI6N8mPcPA7zqbR5wZ7',
      tags: ['default'],
    });

    expect(paymentMethod.id).toBe(paymentMethodId);
  });

  it('should add tags to a payment method', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post(`/stripe/users/${userId}/paymentMethods/${paymentMethodId}/addTags`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.payments.stripe.addTagsToPaymentMethod(
      userId,
      paymentMethodId,
      {
        tags: ['tags1'],
      }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove tags to a payment method', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post(
        `/stripe/users/${userId}/paymentMethods/${paymentMethodId}/removeTags`
      )
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.payments.stripe.removeTagsToPaymentMethod(
      userId,
      paymentMethodId,
      {
        tags: ['tags1'],
      }
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete a payment method', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .delete(`/stripe/users/${userId}/paymentMethods/${paymentMethodId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.payments.stripe.removePaymentMethod(
      userId,
      paymentMethodId
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should create an order linked to a Stripe payment intent', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .post('/stripe/paymentIntents')
      .reply(200, orderData);

    const order = await sdk.payments.stripe.createPaymentIntent(paymentIntent);

    expect(order.id).toBe(orderId);
  });

  it('should create a Stripe setup intent for capturing payment details without initial payment', async () => {
    nock(`${host}${PAYMENTS_BASE}`).post('/stripe/setupIntents').reply(200, {
      stripeClientSecret: 'secret',
    });

    const setupIntent = await sdk.payments.stripe.createSetupIntent({
      setupPaymentMethodReuse:
        PaymentIntentCreationSchemaSetupPaymentMethodReuse.OFF_SESSION,
    });

    expect(setupIntent.stripeClientSecret).toBe('secret');
  });

  it("should receive incoming events from Stripe's webhook", async () => {
    nock(`${host}${PAYMENTS_BASE}`).post('/stripe/events').reply(200);

    const res = await sdk.payments.stripe.subscribeToEvents();

    expect(res).toBeDefined();
  });
});
