import type { HttpInstance } from '../../types';
import type { PagedResult, ResultResponse } from '../types';
import { Results } from '../types';
import type {
  TransactionCompletionDataSchema,
  AppleReceiptExampleSchema,
  ReceiptVerificationDataSchema,
  AppleNotification,
  AppStoreNotification,
  AppStoreReceipt,
  PaymentsAppStoreService,
} from './types';

export default (client, httpAuth: HttpInstance): PaymentsAppStoreService => ({
  async createTransaction(
    requestBody: TransactionCompletionDataSchema
  ): Promise<AppleReceiptExampleSchema> {
    return (
      await client.post(httpAuth, '/appStore/completeTransaction', requestBody)
    ).data;
  },

  async verifyTransaction(
    requestBody: ReceiptVerificationDataSchema
  ): Promise<AppleReceiptExampleSchema> {
    return (await client.post(httpAuth, '/appStore/verifyReceipt', requestBody))
      .data;
  },

  async processNotification(requestBody: AppleNotification): Promise<boolean> {
    const result: ResultResponse = await client.post(
      httpAuth,
      '/appStore/processServerNotification',
      requestBody
    );
    return result.status === Results.Success;
  },

  async getNotifications(): Promise<PagedResult<AppStoreNotification>> {
    return (await client.get(httpAuth, '/appStore/receivedNotifications')).data;
  },

  async getReceipts(): Promise<PagedResult<AppStoreReceipt>> {
    return (await client.get(httpAuth, '/appStore/receivedReceipts')).data;
  },
});
