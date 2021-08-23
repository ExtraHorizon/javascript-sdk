import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { ResultResponse } from '../types';
import { Results } from '../types';
import type { PaymentsAppStoreService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsAppStoreService => ({
  async createTransaction(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        '/appStore/completeTransaction',
        requestBody,
        options
      )
    ).data;
  },

  async verifyTransaction(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        '/appStore/verifyReceipt',
        requestBody,
        options
      )
    ).data;
  },

  async processNotification(requestBody, options) {
    const result: ResultResponse = await client.post(
      httpAuth,
      '/appStore/processServerNotification',
      requestBody,
      options
    );
    return result.status === Results.Success;
  },

  async getNotifications(options) {
    return (
      await client.get(httpAuth, '/appStore/receivedNotifications', options)
    ).data;
  },

  async getReceipts(options) {
    return (await client.get(httpAuth, '/appStore/receivedReceipts', options))
      .data;
  },
});
