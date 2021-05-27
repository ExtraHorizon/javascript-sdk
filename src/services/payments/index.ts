import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import products from './products';
import orders from './orders';
import { PAYMENTS_BASE } from '../../constants';

export type PaymentsService = {
  products: ReturnType<typeof products>;
  orders: ReturnType<typeof orders>;
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
  };
};
