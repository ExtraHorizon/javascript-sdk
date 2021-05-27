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
