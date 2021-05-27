import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import products from './products';
import { PAYMENTS_BASE } from '../../constants';

export type PaymentsService = ReturnType<typeof products>;

export const paymentsService = (
  httpWithAuth: HttpInstance
): PaymentsService => {
  const client = httpClient({
    basePath: PAYMENTS_BASE,
  });

  const productsMethods = products(client, httpWithAuth);

  return {
    ...productsMethods,
  };
};
