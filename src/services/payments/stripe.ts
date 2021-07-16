import type { HttpInstance } from '../../types';
import type { AffectedRecords, ObjectId } from '../types';
import type {
  StripeUser,
  StripePaymentMethod,
  StripePaymentMethodCreation,
  UpdateTagsSchema,
  PaymentIntentCreationSchema,
  OrderSchema,
  SetupIntentCreationSchema,
  StripeSetupIntentSchema,
  PaymentsStripeService,
} from './types';

export default (client, httpAuth: HttpInstance): PaymentsStripeService => ({
  async getUser(userId: ObjectId): Promise<StripeUser> {
    return (await client.get(httpAuth, `/stripe/users/${userId}`)).data;
  },

  async savePaymentMethod(
    userId: ObjectId,
    requestBody: StripePaymentMethodCreation
  ): Promise<StripePaymentMethod> {
    return (
      await client.post(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods`,
        requestBody
      )
    ).data;
  },

  async addTagsToPaymentMethod(
    userId: ObjectId,
    paymentMethodId: ObjectId,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods/${paymentMethodId}/addTags`,
        requestBody
      )
    ).data;
  },

  async removeTagsToPaymentMethod(
    userId: ObjectId,
    paymentMethodId: ObjectId,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords> {
    return (
      await client.post(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods/${paymentMethodId}/removeTags`,
        requestBody
      )
    ).data;
  },

  async removePaymentMethod(
    userId: ObjectId,
    paymentMethodId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await client.delete(
        httpAuth,
        `/stripe/users/${userId}/paymentMethods/${paymentMethodId}`
      )
    ).data;
  },

  async createPaymentIntent(
    requestBody: PaymentIntentCreationSchema
  ): Promise<OrderSchema> {
    return (await client.post(httpAuth, '/stripe/paymentIntents', requestBody))
      .data;
  },

  async createSetupIntent(
    requestBody: SetupIntentCreationSchema
  ): Promise<StripeSetupIntentSchema> {
    return (await client.post(httpAuth, '/stripe/setupIntents', requestBody))
      .data;
  },

  async subscribeToEvents(): Promise<any> {
    return (await client.post(httpAuth, '/stripe/events')).data;
  },
});
