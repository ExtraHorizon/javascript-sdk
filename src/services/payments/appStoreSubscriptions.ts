import type { HttpInstance } from '../../types';
import type { AffectedRecords, PagedResult, ObjectId } from '../types';
import type {
  AppStoreSubscription,
  AppStoreSubscriptionProduct,
  AppStoreSubscriptionProductCreation,
  AppStoreSubscriptionProductUpdateSchema,
  PaymentsAppStoreSubscriptionsService,
} from './types';

export default (
  client,
  httpAuth: HttpInstance
): PaymentsAppStoreSubscriptionsService => ({
  async getSubscriptions(): Promise<PagedResult<AppStoreSubscription>> {
    return (await client.get(httpAuth, '/appStore/subscriptions')).data;
  },

  async getSubscriptionsProducts(): Promise<
    PagedResult<AppStoreSubscriptionProduct>
  > {
    return (await client.get(httpAuth, '/appStore/subscriptions/products'))
      .data;
  },

  async createSubscriptionsProduct(
    requestBody: AppStoreSubscriptionProductCreation
  ): Promise<AppStoreSubscriptionProduct> {
    return (
      await client.post(
        httpAuth,
        '/appStore/subscriptions/products',
        requestBody
      )
    ).data;
  },

  async removeSubscriptionsProduct(
    productId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(
        httpAuth,
        `/appStore/subscriptions/products/${productId}`
      )
    ).data;
  },

  async updateSubscriptionsProduct(
    productId: ObjectId,
    requestBody: AppStoreSubscriptionProductUpdateSchema
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/appStore/subscriptions/products/${productId}`,
        requestBody
      )
    ).data;
  },
});
