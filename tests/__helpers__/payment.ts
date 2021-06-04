import {
  ProductCreationSchema,
  OrderSchema,
  OrderSchemaStatus,
  OrderCreationSchema,
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

export const productResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [productData],
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

export const orderResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [orderData],
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
