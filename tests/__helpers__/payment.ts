import {
  ProductCreationSchema,
  OrderSchema,
  OrderSchemaStatus,
  OrderCreationSchema,
  SubscriptionEntitlement,
  SubscriptionEntitlementSource,
  SubscriptionEntitlementStatus,
  SubscriptionEntitlementStatusCategory,
  SubscriptionEvent,
  SubscriptionEventSource,
  SubscriptionEventType,
  AppleReceiptExampleSchema,
  AppleNotification,
  AppStoreNotification,
  AppStoreReceipt,
  AppStoreSubscription,
  AppStoreSubscriptionProduct,
  StripeUser,
  StripePaymentMethod,
  PaymentIntentCreationSchema,
  PaymentIntentCreationSchemaSetupPaymentMethodReuse,
  PaymentIntentCreationSchemaPaymentMethodType,
  PlayStoreDeveloperNotificationMessageSchema,
  PlayStoreDeveloperNotificationSchema,
  PlayStorePurchaseRecord,
  PlayStoreSubscriptionPurchaseRecordSchema,
  PlayStoreSubscription,
  PlayStoreSubscriptionProduct,
  AppStoreSharedSecret,
  AppStoreSharedSecretCreation,
} from '../../src/services/payments/types';

export const newProductData: ProductCreationSchema = {
  name: 'Prescription 30D',
  prices: {
    eur: {
      amount: 2500,
    },
    usd: {
      amount: 2600,
    },
  },
  appStoreProductId: '1ce9a386fc4144609418ad0d5c4e9f49',
  taskFunctionName: 'addPrescription',
  taskPriority: 3,
  tags: ['mobileOnly'],
  schema: {
    required: ['color'],
    properties: {
      color: {
        type: 'string',
      },
      secondaryColor: {
        type: 'string',
      },
    },
  },
};

export const productData = {
  id: '507f191e810c19729de860ea',
  creatorId: '507f191e810c19729de890be',
  price: 2500,
  currency: 'eur',
  ...newProductData,
};

export const orderData: OrderSchema = {
  id: '507f191e810c19729de860ea',
  creatorId: '507f191e810c19729de860ea',
  targetUserId: '507f191e810c19729de860ea',
  status: OrderSchemaStatus.CREATED,
  currency: 'eur',
  product: {
    name: 'Prescription 30D',
    prices: {
      eur: {
        amount: 2500,
      },
      usd: {
        amount: 2600,
      },
    },
    appStoreProductId: '1ce9a386fc4144609418ad0d5c4e9f49',
    taskFunctionName: 'addPrescription',
    taskPriority: 3,
    tags: ['mobileOnly'],
    schema: {
      required: ['color'],
      properties: {
        color: {
          type: 'string',
        },
        secondaryColor: {
          type: 'string',
        },
      },
    },
    id: '507f191e810c19729de860ea',
    creatorId: '507f191e810c19729de890be',
    price: 2500,
    currency: 'eur',
  },
  data: {
    color: 'blue',
    secondaryColor: 'red',
  },
  events: [
    {
      type: 'source.chargeable',
      eventIdStripe: 'evt_1ENL9JIp7N0q7Db10f0PGwc6',
      resourceIdStripe: 'src_1ENL9DIp7N0q7Db1oZFOef2a',
      resourceType: 'source',
      creationTimestamp: new Date('2021-06-04T11:47:31.601Z'),
    },
  ],
  paymentProvider: 'appStore',
  paymentId: '1000000472106082',
  stripeClientSecret: 'string',
  tags: ['tag1'],
  updateTimestamp: new Date('2021-06-04T11:47:31.601Z'),
  creationTimestamp: new Date('2021-06-04T11:47:31.601Z'),
};

export const newOrder: OrderCreationSchema = {
  productId: '507f191e810c19729de860ea',
  currency: 'eur',
  tags: ['tag1'],
  data: {
    color: 'blue',
    secondaryColor: 'red',
  },
};

export const subscriptionEntitlementData: SubscriptionEntitlement = {
  id: '507f191e810c19729de860ea',
  userId: '507f191e810c19729de860ea',
  source: SubscriptionEntitlementSource.APP_STORE,
  sourceProductId: '507f191e810c19729de860ea',
  subscriptionGroup: 'fibricheck',
  subscriptionTier: 'premium',
  status: SubscriptionEntitlementStatus.USING_FREE_TRIAL,
  statusCategory: SubscriptionEntitlementStatusCategory.ACQUIRING,
  expireTimestamp: new Date('2021-06-04T12:01:02.782Z'),
  newProductId: '507f191e810c19729de860ea',
  creationTimestamp: new Date('2021-06-04T12:01:02.782Z'),
};

export const subscriptionEventData: SubscriptionEvent = {
  id: '507f191e810c19729de860ea',
  userId: '507f191e810c19729de860ea',
  creationTimestamp: new Date('2021-06-04T12:01:02.786Z'),
  source: SubscriptionEventSource.APP_STORE,
  sourceProductId: '507f191e810c19729de860ea',
  subscriptionGroup: 'fibricheck',
  subscriptionTier: 'premium',
  type: SubscriptionEventType.STARTED,
  expireTimestamp: new Date('2021-06-04T12:01:02.786Z'),
};

export const appleReceipt: AppleReceiptExampleSchema = {
  environment: 'Sandbox',
  receipt: {},
  latest_receipt_info: [{}],
  latest_receipt: 'MIId8AYJKoZIhvcNA...',
  pending_renewal_info: [{}],
  status: 0,
};

export const appleNotification: AppleNotification = {
  auto_renew_product_id: 'string',
  auto_renew_status: 'string',
  auto_renew_status_change_date_ms: 'string',
  environment: 'string',
  notification_type: 'string',
  password: 'string',
  unified_receipt: {
    environment: 'string',
    latest_receipt: 'string',
    latest_receipt_info: [
      {
        expires_date: 'string',
        expires_date_ms: 'string',
        expires_date_pst: 'string',
        is_in_intro_offer_period: 'string',
        is_trial_period: 'string',
        original_purchase_date: 'string',
        original_purchase_date_ms: 'string',
        original_purchase_date_pst: 'string',
        original_transaction_id: 'string',
        product_id: 'string',
        purchase_date: 'string',
        purchase_date_ms: 'string',
        purchase_date_pst: 'string',
        quantity: 'string',
        subscription_group_identifier: 'string',
        transaction_id: 'string',
        web_order_line_item_id: 'string',
      },
    ],
    pending_renewal_info: [
      {
        auto_renew_product_id: 'string',
        auto_renew_status: 'string',
        expiration_intent: 'string',
        is_in_billing_retry_period: 'string',
        original_transaction_id: 'string',
        product_id: 'string',
      },
    ],
    status: 0,
  },
  bid: 'string',
  bvrs: 'string',
};

export const playStoreDeveloperNotificationMessage: PlayStoreDeveloperNotificationMessageSchema =
  {
    message: {
      attributes: {},
      data: 'data',
      messageId: 'messageId',
      publishTime: new Date(),
    },
    subscription: 'subscription',
  };

export const playStoreDeveloperNotificationSchema: PlayStoreDeveloperNotificationSchema =
  {
    version: 'version1',
    packageName: 'packageName',
    eventTimeMillis: 1,
    subscriptionNotification: {
      version: '1',
      notificationType: 1,
      purchaseToken: 'token',
      subscriptionId: 'subscriptionI',
    },
  };

export const playStorePurchaseRecord: PlayStorePurchaseRecord = {
  receipt: {
    packageName: 'packageName',
    subscriptionId: 'subscriptionId',
    purchaseToken: 'purchaseToken',
  },
  userId: 'userId',
  id: 'id',
  creationTimestamp: new Date(),
};

export const playStoreSubscriptionPurchaseRecordSchema: PlayStoreSubscriptionPurchaseRecordSchema =
  {
    receipt: {
      packageName: 'packageName',
      subscriptionId: 'subscriptionId',
      purchaseToken: 'purchaseToken',
    },
    id: 'id',
    creationTimestamp: new Date(),
    purchaseInfo: undefined,
  };

export const appStoreNotification: AppStoreNotification = {
  id: '507f191e810c19729de860ea',
  creationTimestamp: new Date('2021-06-04T12:56:57.298Z'),
  updateTimestamp: new Date('2021-06-04T12:56:57.298Z'),
  data: {
    auto_renew_product_id: 'string',
    auto_renew_status: 'string',
    auto_renew_status_change_date_ms: 'string',
    environment: 'string',
    notification_type: 'string',
    password: 'string',
    unified_receipt: {
      environment: 'string',
      latest_receipt: 'string',
      latest_receipt_info: [
        {
          expires_date: 'string',
          expires_date_ms: 'string',
          expires_date_pst: 'string',
          is_in_intro_offer_period: 'string',
          is_trial_period: 'string',
          original_purchase_date: 'string',
          original_purchase_date_ms: 'string',
          original_purchase_date_pst: 'string',
          original_transaction_id: 'string',
          product_id: 'string',
          purchase_date: 'string',
          purchase_date_ms: 'string',
          purchase_date_pst: 'string',
          quantity: 'string',
          subscription_group_identifier: 'string',
          transaction_id: 'string',
          web_order_line_item_id: 'string',
        },
      ],
      pending_renewal_info: [
        {
          auto_renew_product_id: 'string',
          auto_renew_status: 'string',
          expiration_intent: 'string',
          is_in_billing_retry_period: 'string',
          original_transaction_id: 'string',
          product_id: 'string',
        },
      ],
      status: 0,
    },
    bid: 'string',
    bvrs: 'string',
  },
};

export const appStoreReceipt: AppStoreReceipt = {
  id: '507f191e810c19729de860ea',
  creationTimestamp: new Date('2021-06-04T12:56:57.312Z'),
  updateTimestamp: new Date('2021-06-04T12:56:57.312Z'),
  userId: '507f191e810c19729de860ea',
  transactionId: '1000000793662117',
  receiptResponse: {
    environment: 'Sandbox',
    receipt: {},
    latest_receipt_info: [{}],
    latest_receipt: 'MIId8AYJKoZIhvcNA...',
    pending_renewal_info: [{}],
    status: 0,
  },
};

export const appStoreSharedSecret: AppStoreSharedSecret = {
  id: 'sharedsecretid',
  creationTimestamp: new Date(),
  applicationId: 'applicationId',
  bundleId: 'com.applicationId',
};

export const appStoreSharedSecretCreation: AppStoreSharedSecretCreation = {
  applicationId: 'applicationId',
  bundleId: 'com.applicationId',
  secret: 'sharedsecret',
};

export const appStoreSubscription: AppStoreSubscription = {
  id: '507f191e810c19729de860ea',
  userId: '507f191e810c19729de860ea',
  productId: 'string',
  bundleId: 'string',
  originalPurchaseDate: new Date('2021-06-04T12:56:57.318Z'),
  originalTransactionId: 'string',
  lastPurchaseDate: new Date('2021-06-04T12:56:57.318Z'),
  expiresDate: new Date('2021-06-04T12:56:57.318Z'),
  autoRenewStatus: true,
  autoRenewStatusChange: new Date('2021-06-04T12:56:57.318Z'),
  latestReceipt: 'string',
  lastTransactionId: 'string',
  state: 'string',
  reevaluateDate: new Date('2021-06-04T12:56:57.318Z'),
  newProductId: 'string',
};

export const appStoreSubscriptionProduct: AppStoreSubscriptionProduct = {
  id: '507f191e810c19729de860ea',
  name: 'FibriCheck Premium Monthly',
  appStoreAppBundleId: 'com.qompium.fibricheck',
  appStoreProductId: 'fibricheck-premium-monthly',
  subscriptionGroup: 'fibricheck',
  subscriptionTier: 'premium',
  updateTimestamp: new Date('2021-06-04T13:15:20.862Z'),
  creationTimestamp: new Date('2021-06-04T13:15:20.862Z'),
};

export const playStoreSubscription: PlayStoreSubscription = {
  id: '507f191e810c19729de860ea',
  expiryTimestamp: new Date(),
  autoRenewing: true,
  paymentState: 1,
  purchaserId: 'purchaserId',
  receipt: {
    packageName: 'packageName',
    subscriptionId: 'subscriptionId',
    purchaseToken: 'purchaseToken',
  },
  creationTimestamp: new Date(),
  updateTimestamp: new Date(),
  lockId: 'lockId',
  lockTimestamp: new Date(),
};

export const playStoreSubscriptionProduct: PlayStoreSubscriptionProduct = {
  id: '507f191e810c19729de860ea',
  name: 'FibriCheck Premium Monthly',
  playStorePackageName: 'com.qompium.fibricheck',
  playStoreSubscriptionId: 'fibricheck-premium-montly',
  subscriptionGroup: 'fibricheck',
  subscriptionTier: 'premium',
  updateTimestamp: new Date('2021-06-04T13:15:20.862Z'),
  creationTimestamp: new Date('2021-06-04T13:15:20.862Z'),
};

export const stripeUser: StripeUser = {
  id: '507f191e810c19729de860ea',
  stripeId: 'cus_FuYumWZQCG1MDp',
  paymentMethods: [
    {
      id: '507f191e810c19729de860ea',
      stripeId: 'pm_1FOjoNI6N8mPcPA7zqbR5wZ7',
      brand: 'visa',
      expirationYear: 2044,
      expirationMonth: 4,
      last4Digits: '4321',
      tags: ['default'],
      updateTimestamp: new Date('2021-06-04T13:15:20.802Z'),
      creationTimestamp: new Date('2021-06-04T13:15:20.802Z'),
    },
  ],
  updateTimestamp: new Date('2021-06-04T13:15:20.802Z'),
  creationTimestamp: new Date('2021-06-04T13:15:20.802Z'),
};

export const stripePaymentMethod: StripePaymentMethod = {
  id: '507f191e810c19729de860ea',
  stripeId: 'pm_1FOjoNI6N8mPcPA7zqbR5wZ7',
  brand: 'visa',
  expirationYear: 2044,
  expirationMonth: 4,
  last4Digits: '4321',
  tags: ['default'],
  updateTimestamp: new Date('2021-06-04T13:15:20.807Z'),
  creationTimestamp: new Date('2021-06-04T13:15:20.807Z'),
};

export const paymentIntent: PaymentIntentCreationSchema = {
  productId: '507f191e810c19729de860ea',
  currency: 'eur',
  tags: ['tag1'],
  data: {
    color: 'blue',
    secondaryColor: 'red',
  },
  setupPaymentMethodReuse:
    PaymentIntentCreationSchemaSetupPaymentMethodReuse.OFF_SESSION,
  targetUserId: '507f191e810c19729de860ea',
  paymentMethodId: '507f191e810c19729de860ea',
  offSession: true,
  paymentMethodType: PaymentIntentCreationSchemaPaymentMethodType.CARD,
};
