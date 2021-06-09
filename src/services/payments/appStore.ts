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
} from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Complete a transaction
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody TransactionCompletionDataSchema
   * @returns AppleReceiptExampleSchema
   *
   * A detailed description of the data can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstorereceipts/responsebody).
   *
   * @throws {InvalidReceiptDataError}
   * @throws {UnknownReceiptTransactionError}
   * @throws {AppStoreTransactionAlreadyLinked}
   * @throws {NoConfiguredAppStoreProduct}
   */
  async createTransaction(
    requestBody: TransactionCompletionDataSchema
  ): Promise<AppleReceiptExampleSchema> {
    return (
      await client.post(httpAuth, '/appStore/completeTransaction', requestBody)
    ).data;
  },

  /**
   * Verify the Receipt of a Transaction
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   *
   * @param requestBody ReceiptVerificationDataSchema
   * @returns AppleReceiptExampleSchema
   *
   * A detailed description of the data can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstorereceipts/responsebody).
   *
   * @throws {InvalidReceiptDataError}
   */
  async verifyTransaction(
    requestBody: ReceiptVerificationDataSchema
  ): Promise<AppleReceiptExampleSchema> {
    return (await client.post(httpAuth, '/appStore/verifyReceipt', requestBody))
      .data;
  },

  /**
   * Processes an App Store Server notification
   * @param requestBody AppleNotification
   * @returns true if the notification was successfully processed
   */
  async processNotification(requestBody: AppleNotification): Promise<boolean> {
    const result: ResultResponse = await client.post(
      httpAuth,
      '/appStore/processServerNotification',
      requestBody
    );
    return result.status === Results.Success;
  },

  /**
   * Get a list of notifications received from the App Store
   * The raw notification as it was received from the App Store.
   * A detailed description of the data structure can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstoreservernotifications/responsebody).
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_APP_STORE_NOTIFICATIONS` | `global` | **Required** for this endpoint
   *
   * @returns PagedResult<AppStoreNotification>
   */
  async getNotifications(): Promise<PagedResult<AppStoreNotification>> {
    return (await client.get(httpAuth, '/appStore/receivedNotifications')).data;
  },

  /**
   * Get a list of receipts received and verified by the App Store
   * The raw receipt as it was received after verification by the App Store.
   * A detailed description of the data can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstorereceipts/responsebody).
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_APP_STORE_RECEIPTS` | `global` | **Required** for this endpoint
   *
   * @returns PagedResult<AppStoreReceipt>
   */
  async getReceipts(): Promise<PagedResult<AppStoreReceipt>> {
    return (await client.get(httpAuth, '/appStore/receivedReceipts')).data;
  },
});
