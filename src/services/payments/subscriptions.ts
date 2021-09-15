import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type {
  PaymentsSubscriptionsService,
  SubscriptionEntitlement,
  SubscriptionEvent,
} from './types';
import { findAllIterator, findAllGeneric } from '../helpers';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsSubscriptionsService => ({
  entitlements: {
    async find(options) {
      return (
        await client.get(
          httpAuth,
          `/subscriptions/entitlements/${options?.rql || ''}`,
          options
        )
      ).data;
    },

    async findAll(options) {
      return findAllGeneric<SubscriptionEntitlement>(this.find, options);
    },

    findAllIterator(options) {
      return findAllIterator<SubscriptionEntitlement>(this.find, options);
    },
  },
  events: {
    async find(options) {
      return (
        await client.get(
          httpAuth,
          `/subscriptions/events/${options?.rql || ''}`,
          options
        )
      ).data;
    },

    async findAll(options) {
      return findAllGeneric<SubscriptionEvent>(this.find, options);
    },

    findAllIterator(options) {
      return findAllIterator<SubscriptionEvent>(this.find, options);
    },
  },
});
