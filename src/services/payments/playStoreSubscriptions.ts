import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type {
  PaymentsPlayStoreSubscriptionsService,
  PlayStoreSubscription,
  PlayStoreSubscriptionProduct,
} from './types';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsPlayStoreSubscriptionsService => ({
  subscriptions: {
    async find(options) {
      return (
        await client.get(
          httpAuth,
          `/playStore/subscriptions/${options?.rql || ''}`,
          options
        )
      ).data;
    },

    async findAll(
      this: PaymentsPlayStoreSubscriptionsService['subscriptions'],
      options
    ) {
      return findAllGeneric<PlayStoreSubscription>(this.find, options);
    },

    findAllIterator(
      this: PaymentsPlayStoreSubscriptionsService['subscriptions'],
      options
    ) {
      return findAllIterator<PlayStoreSubscription>(this.find, options);
    },
  },

  products: {
    async find(options) {
      return (
        await client.get(
          httpAuth,
          `/playStore/subscriptions/products/${options?.rql || ''}`,
          options
        )
      ).data;
    },

    async findAll(
      this: PaymentsPlayStoreSubscriptionsService['products'],
      options
    ) {
      return findAllGeneric<PlayStoreSubscriptionProduct>(this.find, options);
    },

    findAllIterator(
      this: PaymentsPlayStoreSubscriptionsService['products'],
      options
    ) {
      return findAllIterator<PlayStoreSubscriptionProduct>(this.find, options);
    },

    async create(requestBody, options) {
      return (
        await client.post(
          httpAuth,
          '/playStore/subscriptions/products',
          requestBody,
          options
        )
      ).data;
    },

    async remove(productId, options) {
      return (
        await client.delete(
          httpAuth,
          `/playStore/subscriptions/products/${productId}`,
          options
        )
      ).data;
    },

    async update(productId, requestBody, options) {
      return (
        await client.put(
          httpAuth,
          `/playStore/subscriptions/products/${productId}`,
          requestBody,
          options
        )
      ).data;
    },
  },
});
