/* eslint-disable camelcase */
import { RQLString } from '../../rql';
import type {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';

export interface ProductCreationSchema {
  name?: string;
  /**
   * The prices property is a hashmap. The key should be a three-letter (lowercase) ISO currency code, e.g. eur, usd, ...  see https://www.iso.org/iso-4217-currency-codes.html We expect that the eur currency is always provided as a key (the default key)
   */
  prices: Record<
    string,
    {
      /**
       * The price (amount) for the specified currency expressed in cents (whole numbers only)
       */
      amount?: number;
    }
  >;
  appStoreProductId?: string;
  /**
   * the task to be executed whenever an order is completed.
   */
  taskFunctionName?: string;
  taskPriority?: number;
  tags?: Array<string>;
  schema?: {
    properties?: Record<
      string,
      {
        type?: 'string' | 'boolean' | 'number';
      }
    >;
    required?: Array<string>;
  };
}

export type ProductSchema = ProductCreationSchema & {
  id?: ObjectId;
  creatorId?: ObjectId;
  /**
   * Price in cents. Will be completly replaced by the prices property in the future, this is only provided for backwards compactibility
   */
  price?: number;
  /**
   * Three-letter (lowercase) ISO currency code, e.g. usd, eur, ... https://www.iso.org/iso-4217-currency-codes.html Will be completly replaced by the prices property in the future, this is only provided for backwards compactibility
   */
  currency?: string;
};

export interface UpdateTagsSchema {
  tags?: Array<string>;
}

export interface OrderSchema {
  id?: ObjectId;
  creatorId?: ObjectId;
  targetUserId?: ObjectId;
  status?: OrderSchemaStatus;
  /**
   * Three-letter (lowercase) ISO currency code, e.g. usd, eur, ... https://www.iso.org/iso-4217-currency-codes.html This an optional property, when it is not provided the backend will restore to using Product.currency and Product.price. When it is provided the backend will use the provided value as the key for getting the price from the Product.prices hashmap.
   */
  currency?: string;
  product?: ProductSchema;
  /**
   * object containing properties as specified on the Product schema
   */
  data?: any;
  /**
   * An array of events that Stripe send for the order
   */
  events?: Array<OrderEventSchema>;
  paymentProvider?: string;
  paymentId?: string;
  stripeClientSecret?: string;
  tags?: Array<string>;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
}

export interface OrderEventSchema {
  type?: string;
  /**
   * The ID to retrieve the event by from Stripe API
   */
  eventIdStripe?: string;
  /**
   * The ID to retrieve the resource related to the event by from Stripe API
   */
  resourceIdStripe?: string;
  resourceType?: string;
  creationTimestamp?: Date;
}

export enum OrderSchemaStatus {
  CREATED = 'created',
  FAILED = 'failed',
  CHARGE_CREATED = 'charge_created',
  TASK_STARTED = 'task_started',
}

export interface OrderCreationSchema {
  productId: ObjectId;
  /**
   * Three-letter (lowercase) ISO currency code, e.g. usd, eur, ... https://www.iso.org/iso-4217-currency-codes.html This an optional property, when it is not provided the backend will restore to using Product.currency and Product.price. When it is provided the backend will use the provided value as the key for getting the price from the Product.prices hashmap.
   */
  currency?: string;
  tags?: Array<string>;
  /**
   * object containing properties as specified on the Product schema
   */
  data?: any;
}

export interface OrderUpdateSchema {
  status?: string;
}

export interface SubscriptionEntitlement {
  id?: ObjectId;
  userId?: ObjectId;
  source?: SubscriptionEntitlementSource;
  sourceProductId?: ObjectId;
  subscriptionGroup?: string;
  subscriptionTier?: string;
  status?: SubscriptionEntitlementStatus;
  statusCategory?: SubscriptionEntitlementStatusCategory;
  expireTimestamp?: Date;
  newProductId?: ObjectId;
  creationTimestamp?: Date;
}

export enum SubscriptionEntitlementSource {
  APP_STORE = 'appStore',
}

export enum SubscriptionEntitlementStatus {
  USING_FREE_TRIAL = 'using_free_trial',
  USING_INTRODUCTORY_PRICING = 'using_introductory_pricing',
  ACTIVE_WITH_RENEWAL = 'active_with_renewal',
  ACTIVE_WITHOUT_RENEWAL = 'active_without_renewal',
  EXPIRED_VOLUNTARILY = 'expired_voluntarily',
  SWITCHING_PRODUCT = 'switching_product',
  SWITCHED_PRODUCT = 'switched_product',
  IN_GRACE_PERIOD = 'in_grace_period',
  IN_BILLING_RETRY = 'in_billing_retry',
  EXPIRED_FROM_BILLING = 'expired_from_billing',
  AWAITING_PRICE_CHANGE_CONFIRMATION = 'awaiting_price_change_confirmation',
  FAILED_TO_CONFIRM_PRICE_CHANGE = 'failed_to_confirm_price_change',
  REVOKED = 'revoked',
  REFUNDED = 'refunded',
  REFUNDED_FOR_ISSUE = 'refunded_for_issue',
}

export enum SubscriptionEntitlementStatusCategory {
  ACQUIRING = 'acquiring',
  ENGAGED = 'engaged',
  ACTIVE_BUT_LOSING = 'active_but_losing',
  INACTIVE_AND_LOSING = 'inactive_and_losing',
  LOST = 'lost',
}

export interface SubscriptionEvent {
  id?: ObjectId;
  userId: ObjectId;
  creationTimestamp?: Date;
  source: SubscriptionEventSource;
  sourceProductId: ObjectId;
  subscriptionGroup: string;
  subscriptionTier: string;
  type?: SubscriptionEventType;
  expireTimestamp?: Date;
}

export enum SubscriptionEventSource {
  APP_STORE = 'appStore',
}

export enum SubscriptionEventType {
  STARTED = 'started',
  STARTED_WITH_FREE_TRIAL = 'started_with_free_trial',
  STARTED_WITH_INTRODUCTORY_PRICING = 'started_with_introductory_pricing',
  RENEWED = 'renewed',
  RENEWAL_DISABLED = 'renewal_disabled',
  RENEWAL_ENABLED = 'renewal_enabled',
  EXPIRED_VOLUNTARILY = 'expired_voluntarily',
  SWITCHING_PRODUCT = 'switching_product',
  SWITCHED_PRODUCT = 'switched_product',
  GRACE_PERIOD_STARTED = 'grace_period_started',
  BILLING_RETRY_STARTED = 'billing_retry_started',
  EXPIRED_FROM_BILLING = 'expired_from_billing',
  PRICE_CHANGE_CONFIRMATION_REQUESTED = 'price_change_confirmation_requested',
  FAILED_TO_CONFIRM_PRICE_CHANGE = 'failed_to_confirm_price_change',
  REVOKED = 'revoked',
  REFUNDED = 'refunded',
  REFUNDED_FOR_ISSUE = 'refunded_for_issue',
}

export interface TransactionCompletionDataSchema {
  /**
   * Base 64 encoded App Store receipt
   */
  receiptData: string;
  /**
   * The id of the transition inside the receipt to complete
   */
  transactionId: string;
}

// The data can be found here: https://developer.apple.com/documentation/appstorereceipts/responsebody
export type AppleReceiptExampleSchema = any;

export interface ReceiptVerificationDataSchema {
  /**
   * Base 64 encoded App Store receipt
   */
  receiptData: string;
}

export interface AppleNotification {
  auto_renew_product_id?: string;
  auto_renew_status?: string;
  auto_renew_status_change_date_ms?: string;
  environment?: string;
  notification_type?: string;
  password?: string;
  unified_receipt?: {
    environment?: string;
    latest_receipt?: string;
    latest_receipt_info?: Array<{
      expires_date?: string;
      expires_date_ms?: string;
      expires_date_pst?: string;
      is_in_intro_offer_period?: string;
      is_trial_period?: string;
      original_purchase_date?: string;
      original_purchase_date_ms?: string;
      original_purchase_date_pst?: string;
      original_transaction_id?: string;
      product_id?: string;
      purchase_date?: string;
      purchase_date_ms?: string;
      purchase_date_pst?: string;
      quantity?: string;
      subscription_group_identifier?: string;
      transaction_id?: string;
      web_order_line_item_id?: string;
    }>;
    pending_renewal_info?: Array<{
      auto_renew_product_id?: string;
      auto_renew_status?: string;
      expiration_intent?: string;
      is_in_billing_retry_period?: string;
      original_transaction_id?: string;
      product_id?: string;
    }>;
    status?: number;
  };
  bid?: string;
  bvrs?: string;
}

export interface AppStoreNotification {
  id?: ObjectId;
  data?: AppleNotification;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface AppStoreReceipt {
  id?: ObjectId;
  userId?: ObjectId;
  transactionId?: string;
  receiptResponse?: AppleReceiptExampleSchema;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface AppStoreSubscription {
  id?: ObjectId;
  userId: ObjectId;
  productId: string;
  bundleId: string;
  originalPurchaseDate: Date;
  originalTransactionId: string;
  lastPurchaseDate: Date;
  expiresDate: Date;
  autoRenewStatus: boolean;
  autoRenewStatusChange: Date;
  latestReceipt: string;
  lastTransactionId?: string;
  state?: string;
  reevaluateDate?: Date;
  newProductId?: string;
}

export interface AppStoreSubscriptionProduct {
  id?: ObjectId;
  name?: string;
  appStoreAppBundleId?: string;
  appStoreProductId?: string;
  subscriptionGroup?: string;
  subscriptionTier?: string;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
}

export interface AppStoreSubscriptionProductCreation {
  name?: string;
  appStoreAppBundleId?: string;
  appStoreProductId?: string;
  subscriptionGroup?: string;
  subscriptionTier?: string;
}

export interface AppStoreSubscriptionProductUpdateSchema {
  name?: string;
}

export interface StripeUser {
  id?: ObjectId;
  stripeId?: string;
  paymentMethods?: Array<StripePaymentMethod>;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
}

export interface StripePaymentMethod {
  id?: ObjectId;
  stripeId?: string;
  brand?: string;
  expirationYear?: number;
  expirationMonth?: number;
  last4Digits?: string;
  tags?: Array<string>;
  updateTimestamp?: Date;
  creationTimestamp?: Date;
}

export interface StripePaymentMethodCreation {
  stripeId: string;
  tags?: Array<string>;
}

export interface PaymentIntentCreationSchema extends OrderCreationSchema {
  setupPaymentMethodReuse?: PaymentIntentCreationSchemaSetupPaymentMethodReuse;
  targetUserId?: ObjectId;
  paymentMethodId?: ObjectId;
  offSession?: boolean;
  paymentMethodType?: PaymentIntentCreationSchemaPaymentMethodType;
}

export enum PaymentIntentCreationSchemaSetupPaymentMethodReuse {
  OFF_SESSION = 'offSession',
  ON_SESSION = 'onSession',
}

export enum PaymentIntentCreationSchemaPaymentMethodType {
  CARD = 'card',
  BANCONTACT = 'bancontact',
  IDEAL = 'ideal',
  GIROPAY = 'giropay',
}

export interface SetupIntentCreationSchema {
  setupPaymentMethodReuse?: PaymentIntentCreationSchemaSetupPaymentMethodReuse;
}

export interface StripeSetupIntentSchema {
  stripeClientSecret?: string;
}

export interface AppStoreSharedSecret {
  id: ObjectId;
  creationTimestamp: Date;
  applicationid: ObjectId;
  bundleId: string;
}

export interface AppStoreSharedSecretCreation {
  applicationId: ObjectId;
  bundleId: string;
  secret: string;
}

export interface PaymentsAppStoreService {
  /**
   * Complete a transaction
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param requestBody TransactionCompletionDataSchema
   * @returns AppleReceiptExampleSchema
   * A detailed description of the data can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstorereceipts/responsebody).
   * @throws {InvalidReceiptDataError}
   * @throws {UnknownReceiptTransactionError}
   * @throws {AppStoreTransactionAlreadyLinked}
   * @throws {NoConfiguredAppStoreProduct}
   */
  createTransaction(
    requestBody: TransactionCompletionDataSchema,
    options?: OptionsBase
  ): Promise<AppleReceiptExampleSchema>;
  /**
   * Verify the Receipt of a Transaction
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param requestBody ReceiptVerificationDataSchema
   * @returns AppleReceiptExampleSchema
   * A detailed description of the data can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstorereceipts/responsebody).
   * @throws {InvalidReceiptDataError}
   */
  verifyTransaction(
    requestBody: ReceiptVerificationDataSchema,
    options?: OptionsBase
  ): Promise<AppleReceiptExampleSchema>;
  /**
   * Processes an App Store Server notification
   * @param requestBody AppleNotification
   * @returns true if the notification was successfully processed
   */
  processNotification(
    requestBody: AppleNotification,
    options?: OptionsBase
  ): Promise<boolean>;
  /**
   * Get a list of notifications received from the App Store
   *
   * The raw notification as it was received from the App Store.
   * A detailed description of the data structure can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstoreservernotifications/responsebody).
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_APP_STORE_NOTIFICATIONS` | `global` | **Required** for this endpoint
   * @returns PagedResult<AppStoreNotification>
   */
  getNotifications(
    options?: OptionsBase
  ): Promise<PagedResult<AppStoreNotification>>;
  /**
   * Get a list of receipts received and verified by the App Store
   *
   * The raw receipt as it was received after verification by the App Store.
   * A detailed description of the data can be found in the [official App Store documentation](https://developer.apple.com/documentation/appstorereceipts/responsebody).
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_APP_STORE_RECEIPTS` | `global` | **Required** for this endpoint
   * @returns PagedResult<AppStoreReceipt>
   */
  getReceipts(options?: OptionsBase): Promise<PagedResult<AppStoreReceipt>>;

  /**
   * Get a list of shared secrets
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_APP_STORE_SHARED_SECRETS` | `global` | **Required** for this endpoint
   * @returns PagedResult<AppStoreSharedSecret>
   */
  getSharedSecrets(
    options?: OptionsWithRql
  ): Promise<PagedResult<AppStoreSharedSecret>>;

  /**
   * Create a shared secret
   *
   * The App Store Shared Secret is used when an Application has to communicate
   * with the App Store The shared secret allows decryption of sensitive data such
   * as receipts and allows the verification of the Application Identifier
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_APP_STORE_SHARED_SECRET` | `global` | **Required** for this endpoint
   * @returns AppStoreSharedSecret
   */
  createSharedSecret(
    requestBody: AppStoreSharedSecretCreation,
    options?: OptionsBase
  ): Promise<AppStoreSharedSecret>;

  /**
   * Delete an AppStore shared secret bassed on its id
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_APP_STORE_SHARED_SECRET` | `global` | **Required** for this endpoint
   * @returns AffectedRecords
   */
  removeSharedSecret(
    secretId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface PaymentsAppStoreSubscriptionsService {
  subscriptions: {
    /**
     * Get a list of App Store subscriptions
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List App Store subscriptions related to you
     * `VIEW_APP_STORE_SUBSCRIPTIONS` | `global` | List App Store subscriptions related to all users
     * @returns PagedResult<AppStoreSubscription>
     */
    find(options?: OptionsWithRql): Promise<PagedResult<AppStoreSubscription>>;
    /**
     * Request a list of all App Store subscriptions
     *
     * Do not pass in an rql with limit operator!
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List App Store subscriptions related to you
     * `VIEW_APP_STORE_SUBSCRIPTIONS` | `global` | List App Store subscriptions related to all users
     * @returns AppStoreSubscription[]
     */
    findAll(options?: OptionsWithRql): Promise<AppStoreSubscription[]>;
    /**
     * Request a list of all App Store subscriptions
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List App Store subscriptions related to you
     * `VIEW_APP_STORE_SUBSCRIPTIONS` | `global` | List App Store subscriptions related to all users
     * @returns AppStoreSubscription[]
     */
    findAllIterator(
      options?: OptionsWithRql
    ): AsyncGenerator<
      PagedResult<AppStoreSubscription>,
      Record<string, never>,
      void
    >;
  };
  products: {
    /**
     * Get a list of configured App Store subscription products
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     * @returns PagedResult<AppStoreSubscriptionProduct>
     */
    find(
      options?: OptionsWithRql
    ): Promise<PagedResult<AppStoreSubscriptionProduct>>;
    /**
     * Request a list of all App Store subscription products
     *
     * Do not pass in an rql with limit operator!
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     * @returns AppStoreSubscriptionProduct[]
     */
    findAll(options?: OptionsWithRql): Promise<AppStoreSubscriptionProduct[]>;
    /**
     * Request a list of all App Store subscription products
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | Everyone can use this endpoint
     * @returns AppStoreSubscriptionProduct[]
     */
    findAllIterator(
      options?: OptionsWithRql
    ): AsyncGenerator<
      PagedResult<AppStoreSubscriptionProduct>,
      Record<string, never>,
      void
    >;
    /**
     * Create an App Store subscription product
     *
     * Permission | Scope | Effect
     * - | - | -
     * `CREATE_APP_STORE_SUBSCRIPTION_PRODUCT` | `global` | **Required** for this endpoint
     * @param requestBody AppStoreSubscriptionProductCreation
     * @returns AppStoreSubscriptionProduct
     * @throws {ResourceAlreadyExistsError}
     */

    create(
      requestBody: AppStoreSubscriptionProductCreation,
      options?: OptionsBase
    ): Promise<AppStoreSubscriptionProduct>;
    /**
     * Delete an App Store subscription product
     *
     * Permission | Scope | Effect
     * - | - | -
     * `DELETE_APP_STORE_SUBSCRIPTION_PRODUCT` | `global` | **Required** for this endpoint
     * @param productId
     * @returns AffectedRecords
     * @throws {ResourceUnknownError}
     */
    remove(
      productId: ObjectId,
      options?: OptionsBase
    ): Promise<AffectedRecords>;
    /**
     * Update an App Store subscription product
     *
     * Permission | Scope | Effect
     * - | - | -
     * `UPDATE_APP_STORE_SUBSCRIPTION_PRODUCT` | `global` | **Required** for this endpoint
     * @param productId
     * @param requestBody AppStoreSubscriptionProductUpdateSchema
     * @returns AffectedRecords
     * @throws {ResourceUnknownError}
     */
    update(
      productId: ObjectId,
      requestBody: AppStoreSubscriptionProductUpdateSchema,
      options?: OptionsBase
    ): Promise<AffectedRecords>;
  };
}

export interface PaymentsOrdersService {
  /**
   * Get a list of orders
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List orders created by you
   * `VIEW_STRIPE_ORDERS` | `global` | List orders created by all users
   * @param rql Add filters to the requested list.
   * @returns PagedResult<OrderSchema>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<OrderSchema>>;
  /**
   * Request a list of all orders
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List orders created by you
   * `VIEW_STRIPE_ORDERS` | `global` | List orders created by all users
   * @param rql Add filters to the requested list.
   * @returns OrderSchema[]
   */
  findAll(options?: OptionsWithRql): Promise<OrderSchema[]>;
  /**
   * Request a list of all orders
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | List orders created by you
   * `VIEW_STRIPE_ORDERS` | `global` | List orders created by all users
   * @param rql Add filters to the requested list.
   * @returns OrderSchema[]
   */
  findAllIterator(
    options?: OptionsWithRql
  ): AsyncGenerator<PagedResult<OrderSchema>, Record<string, never>, void>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<OrderSchema>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<OrderSchema>;
  /**
   * Create an order
   * @param requestBody
   * @returns OrderSchema
   * @throws {ResourceAlreadyExistsError}
   * @throws {InvalidCurrencyForProductPrice}
   */
  create(
    requestBody: OrderCreationSchema,
    options?: OptionsBase
  ): Promise<OrderSchema>;
  /**
   * Update the status of an order
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_ORDERS` | `global` | **Required** for this endpoint
   * @param orderId The order Id
   * @param requestBody OrderUpdateSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  update(
    orderId: ObjectId,
    requestBody: OrderUpdateSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Add Tags to an Order
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_ORDERS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  addTagsToOrder(
    rql: RQLString,
    requestBody: UpdateTagsSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove Tags from an Order
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_ORDERS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  removeTagsFromOrder(
    rql: RQLString,
    requestBody: UpdateTagsSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface PaymentsProductsService {
  /**
   * Create a product
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns ProductSchema
   */
  create(
    requestBody: ProductCreationSchema,
    options?: OptionsBase
  ): Promise<ProductSchema>;
  /**
   * Get a list of products
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<ProductSchema>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<ProductSchema>>;
  /**
   * Request a list of all products
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param rql Add filters to the requested list.
   * @returns ProductSchema[]
   */
  findAll(options?: OptionsWithRql): Promise<ProductSchema[]>;
  /**
   * Request a list of all products
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Everyone can use this endpoint
   * @param rql Add filters to the requested list.
   * @returns ProductSchema[]
   */
  findAllIterator(
    options?: OptionsWithRql
  ): AsyncGenerator<PagedResult<ProductSchema>, Record<string, never>, void>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<ProductSchema>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<ProductSchema>;
  /**
   * Add Tags to a Product
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  addTagsToProduct(
    rql: RQLString,
    requestBody: UpdateTagsSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove tags from a Product
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list, **required**.
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   */
  removeTagsFromProduct(
    rql: RQLString,
    requestBody: UpdateTagsSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Update a product
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   * @param productId ID of the Product
   * @param requestBody ProductCreationSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  update(
    orderId: ObjectId,
    requestBody: ProductCreationSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete a product
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_STRIPE_PRODUCTS` | `global` | **Required** for this endpoint
   * @param productId ID of the Product
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(productId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;
}

export interface PaymentsStripeService {
  /**
   * Get the saved Stripe data for a user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Get the saved Stripe data for your user
   * `VIEW_STRIPE_USERS` | `global` | Get the saved Stripe data for all users
   * @param userId
   * @returns StripeUser
   */
  getUser(userId: ObjectId, options?: OptionsBase): Promise<StripeUser>;
  /**
   * Save a payment method to a Stripe user
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Save a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Save a payment method for any users
   * @param userId
   * @param requestBody StripePaymentMethodCreation
   * @returns StripePaymentMethod
   * @throws {StripePaymentMethodError}
   * @throws {StripeRequestError}
   */
  savePaymentMethod(
    userId: ObjectId,
    requestBody: StripePaymentMethodCreation,
    options?: OptionsBase
  ): Promise<StripePaymentMethod>;
  /**
   * Add tags to a payment method
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Add a tag to a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Add a tag to a payment method for any users
   * @param userId
   * @param paymentMethodId
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  addTagsToPaymentMethod(
    userId: ObjectId,
    paymentMethodId: ObjectId,
    requestBody: UpdateTagsSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Remove tags from a payment method
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Remove tag(s) from a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Remove tag(s) from a payment method for any users
   * @param userId
   * @param paymentMethodId
   * @param requestBody UpdateTagsSchema
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  removeTagsToPaymentMethod(
    userId: ObjectId,
    paymentMethodId: ObjectId,
    requestBody: UpdateTagsSchema,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete a payment method
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Delete a payment method for your user
   * `UPDATE_STRIPE_USERS` | `global` | Delete a payment method for any users
   * @param userId
   * @param paymentMethodId
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  removePaymentMethod(
    userId: ObjectId,
    paymentMethodId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Create an order linked to a Stripe Payment Intent
   *
   * Permission | Scope | Effect
   * - | - | -
   * none |  | Create an order linked to a Stripe Payment Intent for your user
   * `CREATE_PAYMENT_INTENTS` | `global` | Create an order linked to a Stripe Payment Intent for any users
   * @param requestBody PaymentIntentCreationSchema
   * @returns OrderSchema
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {StripePaymentMethodError}
   * @throws {InvalidCurrencyForProductPrice}
   * @throws {ResourceUnknownError}
   */
  createPaymentIntent(
    requestBody: PaymentIntentCreationSchema,
    options?: OptionsBase
  ): Promise<OrderSchema>;
  /**
   * Create a Stripe Setup Intent for capturing payment details without initial payment
   * @param requestBody SetupIntentCreationSchema
   * @returns StripeSetupIntentSchema
   * @throws {StripePaymentMethodError}
   */
  createSetupIntent(
    requestBody: SetupIntentCreationSchema,
    options?: OptionsBase
  ): Promise<StripeSetupIntentSchema>;
  /**
   * Incoming events from Stripe's webhook
   *
   * Stripe docs for webhooks: https://stripe.com/docs/webhooks/setup#create-endpoint.
   * Allowed events:
   * - 'source.chargeable'
   * - 'source.canceled'
   * - 'source.failed'
   * - 'charge.pending'
   * - 'charge.failed'
   * - 'charge.succeeded'
   * - 'payment_intent.payment_failed'
   * - 'payment_intent.succeeded'
   * @returns any
   * @throws {BadRequestError}
   */
  subscribeToEvents(options?: OptionsBase): Promise<any>;
}

export interface PaymentsSubscriptionsService {
  entitlements: {
    /**
     * Get a list of subscription entitlements
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List entitlements related to you
     * `VIEW_SUBSCRIPTION_ENTITLEMENTS` | `global` | List entitlements related to all users
     * @returns PagedResult<SubscriptionEntitlement>
     */
    find(
      options?: OptionsWithRql
    ): Promise<PagedResult<SubscriptionEntitlement>>;
    /**
     * Request a list of all subscription entitlements
     *
     * Do not pass in an rql with limit operator!
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List entitlements related to you
     * `VIEW_SUBSCRIPTION_ENTITLEMENTS` | `global` | List entitlements related to all users
     * @returns SubscriptionEntitlement[]
     */
    findAll(options?: OptionsWithRql): Promise<SubscriptionEntitlement[]>;
    /**
     * Request a list of all subscription entitlements
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List entitlements related to you
     * `VIEW_SUBSCRIPTION_ENTITLEMENTS` | `global` | List entitlements related to all users
     * @returns SubscriptionEntitlement[]
     */
    findAllIterator(
      options?: OptionsWithRql
    ): AsyncGenerator<
      PagedResult<SubscriptionEntitlement>,
      Record<string, never>,
      void
    >;
  };
  events: {
    /**
     * Get a list of subscription events
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List events related to you
     * `VIEW_SUBSCRIPTION_EVENTS` | `global` | List events related to all users
     * @returns PagedResult<SubscriptionEvent>
     */
    find(options?: OptionsWithRql): Promise<PagedResult<SubscriptionEvent>>;
    /**
     * Request a list of all subscription events
     *
     * Do not pass in an rql with limit operator!
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List events related to you
     * `VIEW_SUBSCRIPTION_EVENTS` | `global` | List events related to all users
     * @returns SubscriptionEvent[]
     */
    findAll(options?: OptionsWithRql): Promise<SubscriptionEvent[]>;
    /**
     * Request a list of all subscription events
     *
     * Permission | Scope | Effect
     * - | - | -
     * none |  | List events related to you
     * `VIEW_SUBSCRIPTION_EVENTS` | `global` | List events related to all users
     * @returns SubscriptionEvent[]
     */
    findAllIterator(
      options?: OptionsWithRql
    ): AsyncGenerator<
      PagedResult<SubscriptionEvent>,
      Record<string, never>,
      void
    >;
  };
}
