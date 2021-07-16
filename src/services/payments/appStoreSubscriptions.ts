import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { AffectedRecords, PagedResult, ObjectId } from '../types';
import type {
  AppStoreSubscription,
  AppStoreSubscriptionProduct,
  AppStoreSubscriptionProductCreation,
  AppStoreSubscriptionProductUpdateSchema,
  PaymentsAppStoreSubscriptionsService,
} from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsAppStoreSubscriptionsService => ({
  async getSubscriptions(options) {
    return (await client.get(httpAuth, '/appStore/subscriptions', options))
      .data;
  },

  async getSubscriptionsProducts(options) {
    return (
      await client.get(httpAuth, '/appStore/subscriptions/products', options)
    ).data;
  },

  async createSubscriptionsProduct(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        '/appStore/subscriptions/products',
        requestBody,
        options
      )
    ).data;
  },

  async removeSubscriptionsProduct(productId, options) {
    return (
      await client.delete(
        httpAuth,
        `/appStore/subscriptions/products/${productId}`,
        options
      )
    ).data;
  },

  async updateSubscriptionsProduct(productId, requestBody, options) {
    return (
      await client.put(
        httpAuth,
        `/appStore/subscriptions/products/${productId}`,
        requestBody,
        options
      )
    ).data;
  },
});
