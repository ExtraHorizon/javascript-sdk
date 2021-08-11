import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { PaymentsStripeService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsStripeService => ({
  async getUser(userId, options) {
    return (await client.get(httpAuth, `/stripe/users/${userId}`, options))
      .data;
  },

  async savePaymentMethod(userId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods`,
        requestBody,
        options
      )
    ).data;
  },

  async addTagsToPaymentMethod(userId, paymentMethodId, requestBody, options) {
    return (
      await client.post(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods/${paymentMethodId}/addTags`,
        requestBody,
        options
      )
    ).data;
  },

  async removeTagsToPaymentMethod(
    userId,
    paymentMethodId,
    requestBody,
    options
  ) {
    return (
      await client.post(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods/${paymentMethodId}/removeTags`,
        requestBody,
        options
      )
    ).data;
  },

  async removePaymentMethod(userId, paymentMethodId, options) {
    return (
      await client.delete(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods/${paymentMethodId}`,
        options
      )
    ).data;
  },

  async createPaymentIntent(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        '/stripe/paymentIntents',
        requestBody,
        options
      )
    ).data;
  },

  async createSetupIntent(requestBody, options) {
    return (
      await client.post(httpAuth, '/stripe/setupIntents', requestBody, options)
    ).data;
  },

  async subscribeToEvents(options) {
    return (await client.post(httpAuth, '/stripe/events', options)).data;
  },
});
