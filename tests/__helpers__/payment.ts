import { ProductCreationSchema } from '../../src/services/payments/types';

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
