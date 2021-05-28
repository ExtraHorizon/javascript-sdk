import type { HttpInstance } from '../../types';
import type { AffectedRecords, PagedResult, ObjectId } from '../types';
import type {
  AppStoreSubscription,
  AppStoreSubscriptionProduct,
  AppStoreSubscriptionProductCreation,
  AppStoreSubscriptionProductUpdateSchema,
} from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Get a list of App Store subscriptions
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List App Store subscriptions related to you
   * `VIEW_APP_STORE_SUBSCRIPTIONS` | `global` | List App Store subscriptions related to all users
   *
   * @returns any Success
   * @throws ApiError
   */
  async getSubscriptions(): Promise<PagedResult<AppStoreSubscription>> {
    return (await client.get(httpAuth, '/appStore/subscriptions')).data;
  },

  /**
   * Get a list of configured App Store subscription products
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @returns any Success
   * @throws ApiError
   */
  async getSubscriptionsProducts(): Promise<
    PagedResult<AppStoreSubscriptionProduct>
  > {
    return (await client.get(httpAuth, '/appStore/subscriptions/products'))
      .data;
  },

  /**
   * Create an App Store subscription product
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_APP_STORE_SUBSCRIPTION_PRODUCT` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns AppStoreSubscriptionProduct Success
   * @throws ApiError
   */
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

  /**
   * Delete an App Store subscription product
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_APP_STORE_SUBSCRIPTION_PRODUCT` | `global` | **Required** for this endpoint
   *
   * @param productId
   * @returns any Operation successful
   * @throws ApiError
   */
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

  /**
   * Update an App Store subscription product
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_APP_STORE_SUBSCRIPTION_PRODUCT` | `global` | **Required** for this endpoint
   *
   * @param productId
   * @param requestBody
   * @returns any Operation successful
   * @throws ApiError
   */
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
