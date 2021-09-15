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
): PaymentsSubscriptionsService => {
  async function findEntitlements(options) {
    return (
      await client.get(
        httpAuth,
        `/subscriptions/entitlements/${options?.rql || ''}`,
        options
      )
    ).data;
  }
  async function findEvents(options) {
    return (
      await client.get(
        httpAuth,
        `/subscriptions/events/${options?.rql || ''}`,
        options
      )
    ).data;
  }
  return {
    entitlements: {
      async find(options) {
        return findEntitlements(options);
      },

      async findAll(options) {
        return findAllGeneric<SubscriptionEntitlement>(
          findEntitlements,
          options
        );
      },

      findAllIterator(options) {
        return findAllIterator<SubscriptionEntitlement>(
          findEntitlements,
          options
        );
      },
    },
    events: {
      async find(options) {
        return findEvents(options);
      },

      async findAll(options) {
        return findAllGeneric<SubscriptionEvent>(findEvents, options);
      },

      findAllIterator(options) {
        return findAllIterator<SubscriptionEvent>(findEvents, options);
      },
    },
  };
};
