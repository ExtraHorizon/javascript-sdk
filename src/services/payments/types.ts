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
