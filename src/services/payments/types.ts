/* eslint-disable camelcase */
import { RQLString } from '../../rql';
import type {
  AffectedRecords,
  ObjectId,
  PagedResult,
  PagedResultWithPager,
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

export interface PaymentsAppStoreService {
  createTransaction(
    this: PaymentsAppStoreService,
    requestBody: TransactionCompletionDataSchema
  ): Promise<AppleReceiptExampleSchema>;
  verifyTransaction(
    this: PaymentsAppStoreService,
    requestBody: ReceiptVerificationDataSchema
  ): Promise<AppleReceiptExampleSchema>;
  processNotification(
    this: PaymentsAppStoreService,
    requestBody: AppleNotification
  ): Promise<boolean>;
  getNotifications(
    this: PaymentsAppStoreService
  ): Promise<PagedResult<AppStoreNotification>>;
  getReceipts(
    this: PaymentsAppStoreService
  ): Promise<PagedResult<AppStoreReceipt>>;
}

export interface PaymentsAppStoreSubscriptionsService {
  getSubscriptions(
    this: PaymentsAppStoreSubscriptionsService
  ): Promise<PagedResult<AppStoreSubscription>>;
  getSubscriptionsProducts(
    this: PaymentsAppStoreSubscriptionsService
  ): Promise<PagedResult<AppStoreSubscriptionProduct>>;
  createSubscriptionsProduct(
    this: PaymentsAppStoreSubscriptionsService,
    requestBody: AppStoreSubscriptionProductCreation
  ): Promise<AppStoreSubscriptionProduct>;
  removeSubscriptionsProduct(
    this: PaymentsAppStoreSubscriptionsService,
    productId: ObjectId
  ): Promise<AffectedRecords>;
  updateSubscriptionsProduct(
    this: PaymentsAppStoreSubscriptionsService,
    productId: ObjectId,
    requestBody: AppStoreSubscriptionProductUpdateSchema
  ): Promise<AffectedRecords>;
}

export interface PaymentsOrdersService {
  find(
    this: PaymentsOrdersService,
    options?: { rql?: RQLString }
  ): Promise<PagedResultWithPager<OrderSchema>>;
  findById(
    this: PaymentsOrdersService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<OrderSchema>;
  findFirst(
    this: PaymentsOrdersService,
    options?: { rql?: RQLString }
  ): Promise<OrderSchema>;
  create(
    this: PaymentsOrdersService,
    requestBody: OrderCreationSchema
  ): Promise<OrderSchema>;
  update(
    this: PaymentsOrdersService,
    orderId: ObjectId,
    requestBody: OrderUpdateSchema
  ): Promise<AffectedRecords>;
  addTagsToOrder(
    this: PaymentsOrdersService,
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords>;
  removeTagsFromOrder(
    this: PaymentsOrdersService,
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords>;
}

export interface PaymentsProductsService {
  create(requestBody: ProductCreationSchema): Promise<ProductSchema>;
  find(
    this: PaymentsProductsService,
    options?: { rql?: RQLString }
  ): Promise<PagedResultWithPager<ProductSchema>>;
  findById(
    this: PaymentsProductsService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<ProductSchema>;
  findFirst(
    this: PaymentsProductsService,
    options?: { rql?: RQLString }
  ): Promise<ProductSchema>;
  addTagsToProduct(
    this: PaymentsProductsService,
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords>;
  removeTagsFromProduct(
    this: PaymentsProductsService,
    rql: RQLString,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords>;
  update(
    this: PaymentsProductsService,
    orderId: ObjectId,
    requestBody: ProductCreationSchema
  ): Promise<AffectedRecords>;
  remove(
    this: PaymentsProductsService,
    productId: ObjectId
  ): Promise<AffectedRecords>;
}

export interface PaymentsStripeService {
  getUser(this: PaymentsStripeService, userId: ObjectId): Promise<StripeUser>;
  savePaymentMethod(
    this: PaymentsStripeService,
    userId: ObjectId,
    requestBody: StripePaymentMethodCreation
  ): Promise<StripePaymentMethod>;
  addTagsToPaymentMethod(
    this: PaymentsStripeService,
    userId: ObjectId,
    paymentMethodId: ObjectId,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords>;
  removeTagsToPaymentMethod(
    this: PaymentsStripeService,
    userId: ObjectId,
    paymentMethodId: ObjectId,
    requestBody: UpdateTagsSchema
  ): Promise<AffectedRecords>;
  removePaymentMethod(
    this: PaymentsStripeService,
    userId: ObjectId,
    paymentMethodId: ObjectId
  ): Promise<AffectedRecords>;
  createPaymentIntent(
    this: PaymentsStripeService,
    requestBody: PaymentIntentCreationSchema
  ): Promise<OrderSchema>;
  createSetupIntent(
    this: PaymentsStripeService,
    requestBody: SetupIntentCreationSchema
  ): Promise<StripeSetupIntentSchema>;
  subscribeToEvents(this: PaymentsStripeService): Promise<any>;
}

export interface PaymentsSubscriptionsService {
  getEntitlements(
    this: PaymentsSubscriptionsService
  ): Promise<PagedResult<SubscriptionEntitlement>>;
  getEvents(
    this: PaymentsSubscriptionsService
  ): Promise<PagedResult<SubscriptionEvent>>;
}
