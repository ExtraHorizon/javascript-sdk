import type { ObjectId } from '../types';

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
  expireTimestamp?: string;
  newProductId?: ObjectId;
  creationTimestamp?: string;
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
  creationTimestamp?: string;
  source: SubscriptionEventSource;
  sourceProductId: ObjectId;
  subscriptionGroup: string;
  subscriptionTier: string;
  type?: SubscriptionEventType;
  expireTimestamp?: string;
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
