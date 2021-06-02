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
} from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Get the saved Stripe data for a user
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Get the saved Stripe data for your user
   * `VIEW_STRIPE_USERS` | `global` | Get the saved Stripe data for all users
   *
   * @param userId
   * @returns StripeUser
   */
  async getUser(userId: ObjectId): Promise<StripeUser> {
    return (await client.get(httpAuth, `/stripe/users/${userId}`)).data;
  },

  /**
   * Save a payment method to a Stripe user
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Save a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Save a payment method for any users
   *
   * @param userId
   * @param requestBody StripePaymentMethodCreation
   * @returns StripePaymentMethod
   * @throws {StripePaymentMethodError}
   * @throws {StripeRequestError}
   */
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

  /**
   * Add tags to a payment method
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Add a tag to a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Add a tag to a payment method for any users
   *
   * @param userId
   * @param paymentMethodId
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
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

  /**
   * Remove tags from a payment method
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Remove tag(s) from a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Remove tag(s) from a payment method for any users
   *
   * @param userId
   * @param paymentMethodId
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
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

  /**
   * Delete a payment method
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Delete a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Delete a payment method for any users
   *
   * @param userId
   * @param paymentMethodId
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
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

  /**
   * Create an order linked to a Stripe Payment Intent
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Create an order linked to a Stripe Payment Intent for your user
   * `CREATE_PAYMENT_INTENTS` | `global` | Create an order linked to a Stripe Payment Intent for any users
   *
   * @param requestBody PaymentIntentCreationSchema
   * @returns OrderSchema
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {StripePaymentMethodError}
   * @throws {InvalidCurrencyForProductPrice}
   * @throws {ResourceUnknownError}
   */
  async createPaymentIntent(
    requestBody: PaymentIntentCreationSchema
  ): Promise<OrderSchema> {
    return (await client.post(httpAuth, '/stripe/paymentIntents', requestBody))
      .data;
  },

  /**
   * Create a Stripe Setup Intent for capturing payment details without initial payment
   * @param requestBody SetupIntentCreationSchema
   * @returns StripeSetupIntentSchema
   * @throws {StripePaymentMethodError}
   */
  async createSetupIntent(
    requestBody: SetupIntentCreationSchema
  ): Promise<StripeSetupIntentSchema> {
    return (await client.post(httpAuth, '/stripe/setupIntents', requestBody))
      .data;
  },

  /**
   * Incoming events from Stripe's webhook
   * Stripe docs for webhooks: https://stripe.com/docs/webhooks/setup#create-endpoint.
   *
   * Allowed events:
   * - 'source.chargeable'
   * - 'source.canceled'
   * - 'source.failed'
   * - 'charge.pending'
   * - 'charge.failed'
   * - 'charge.succeeded'
   * - 'payment_intent.payment_failed'
   * - 'payment_intent.succeeded'
   *
   * @returns any Success
   * @throws {BadRequestError}
   */
  async subscribeToEvents(): Promise<any> {
    return (await client.post(httpAuth, '/stripe/events')).data;
  },
});
