import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { PaymentsPlayStoreHistoryService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsPlayStoreHistoryService => ({
  async purchases(options) {
    return (await client.get(httpAuth, '/playStore/history/purchases', options))
      .data;
  },

  async notifications(options) {
    return (
      await client.get(httpAuth, '/playStore/history/notifications', options)
    ).data;
  },

  async purchaseInfos(options) {
    return (
      await client.get(httpAuth, '/playStore/history/purchaseInfos', options)
    ).data;
  },
});
