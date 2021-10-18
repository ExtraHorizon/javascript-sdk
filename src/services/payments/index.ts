import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import health from './health';
import products from './products';
import orders from './orders';
import subscriptions from './subscriptions';
import appStore from './appStore';
import appStoreSubscriptions from './appStoreSubscriptions';
import stripe from './stripe';
import { PAYMENTS_BASE } from '../../constants';
import {
  PaymentsAppStoreService,
  PaymentsAppStoreSubscriptionsService,
  PaymentsOrdersService,
  PaymentsProductsService,
  PaymentsStripeService,
  PaymentsSubscriptionsService,
  PaymentsPlayStoreService,
  PaymentsPlayStoreSubscriptionsService,
  PaymentsPlayStoreHistoryService,
} from './types';
import playStore from './playStore';
import playStoreSubscriptions from './playStoreSubscriptions';
import playStoreHistory from './playStoreHistory';

export type PaymentsService = ReturnType<typeof health> & {
  products: PaymentsProductsService;
  orders: PaymentsOrdersService;
  subscriptions: PaymentsSubscriptionsService;
  appStore: PaymentsAppStoreService;
  appStoreSubscriptions: PaymentsAppStoreSubscriptionsService;
  playStore: PaymentsPlayStoreService;
  playStoreHistory: PaymentsPlayStoreHistoryService;
  playStoreSubscriptions: PaymentsPlayStoreSubscriptionsService;
  stripe: PaymentsStripeService;
};

export const paymentsService = (
  httpWithAuth: HttpInstance
): PaymentsService => {
  const client = httpClient({
    basePath: PAYMENTS_BASE,
  });

  return {
    ...health(client, httpWithAuth),
    products: products(client, httpWithAuth),
    orders: orders(client, httpWithAuth),
    subscriptions: subscriptions(client, httpWithAuth),
    appStore: appStore(client, httpWithAuth),
    appStoreSubscriptions: appStoreSubscriptions(client, httpWithAuth),
    playStore: playStore(client, httpWithAuth),
    playStoreHistory: playStoreHistory(client, httpWithAuth),
    playStoreSubscriptions: playStoreSubscriptions(client, httpWithAuth),
    stripe: stripe(client, httpWithAuth),
  };
};
