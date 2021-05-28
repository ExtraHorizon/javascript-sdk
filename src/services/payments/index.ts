import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import products from './products';
import orders from './orders';
import subscriptions from './subscriptions';
import appStore from './appStore';
import appStoreSubscriptions from './appStoreSubscriptions';
import { PAYMENTS_BASE } from '../../constants';

export type PaymentsService = {
  products: ReturnType<typeof products>;
  orders: ReturnType<typeof orders>;
  subscriptions: ReturnType<typeof subscriptions>;
  appStore: ReturnType<typeof appStore>;
  appStoreSubscriptions: ReturnType<typeof appStoreSubscriptions>;
};

export const paymentsService = (
  httpWithAuth: HttpInstance
): PaymentsService => {
  const client = httpClient({
    basePath: PAYMENTS_BASE,
  });

  return {
    products: products(client, httpWithAuth),
    orders: orders(client, httpWithAuth),
    subscriptions: subscriptions(client, httpWithAuth),
    appStore: appStore(client, httpWithAuth),
    appStoreSubscriptions: appStoreSubscriptions(client, httpWithAuth),
  };
};
