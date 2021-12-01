import type { HttpInstance } from '../../types';
import { HttpClient } from '../http-client';
import type { PaymentsPlayStoreService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): PaymentsPlayStoreService => ({
  async complete(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        '/playStore/completePurchase',
        requestBody,
        options
      )
    ).data;
  },

  async processDeveloperNotification(requestBody, options) {
    return (
      await client.post(
        httpAuth,
        '/playStore/processDeveloperNotification',
        requestBody,
        options
      )
    ).data;
  },
});
