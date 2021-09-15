import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type {
  PaymentsAppStoreSubscriptionsService,
  AppStoreSubscription,
  AppStoreSubscriptionProduct,
} from './types';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsAppStoreSubscriptionsService => {
  async function findSubscriptions(options) {
    return (
      await client.get(
        httpAuth,
        `/appStore/subscriptions/${options?.rql || ''}`,
        options
      )
    ).data;
  }
  async function findProducts(options) {
    return (
      await client.get(
        httpAuth,
        `/appStore/subscriptions/products/${options?.rql || ''}`,
        options
      )
    ).data;
  }
  return {
    subscriptions: {
      async find(options) {
        return findSubscriptions(options);
      },

      async findAll(options) {
        return findAllGeneric<AppStoreSubscription>(findSubscriptions, options);
      },

      findAllIterator(options) {
        return findAllIterator<AppStoreSubscription>(
          findSubscriptions,
          options
        );
      },
    },

    products: {
      async find(options) {
        return findProducts(options);
      },

      async findAll(options) {
        return findAllGeneric<AppStoreSubscriptionProduct>(
          findProducts,
          options
        );
      },

      findAllIterator(options) {
        return findAllIterator<AppStoreSubscriptionProduct>(
          findProducts,
          options
        );
      },

      async create(requestBody, options) {
        return (
          await client.post(
            httpAuth,
            '/appStore/subscriptions/products',
            requestBody,
            options
          )
        ).data;
      },

      async remove(productId, options) {
        return (
          await client.delete(
            httpAuth,
            `/appStore/subscriptions/products/${productId}`,
            options
          )
        ).data;
      },

      async update(productId, requestBody, options) {
        return (
          await client.put(
            httpAuth,
            `/appStore/subscriptions/products/${productId}`,
            requestBody,
            options
          )
        ).data;
      },
    },
  };
};
