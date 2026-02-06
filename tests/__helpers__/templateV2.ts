import { TemplateV2Creation, TemplateV2 } from '../../src/services/templatesV2/types';
import { randomHexString } from './utils';

export const generateTemplateInput = (): TemplateV2Creation => ({
  name: randomHexString(),
  description: randomHexString(),
  properties: {
    shippingInfo: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
      },
    },
  },
  outputs: {
    subject: 'Order for Mr {{ @data.shippingInfo.lastname }}',
    body: 'Hey Mr {{ @data.shippingInfo.lastname }},',
  },
});

export const generateTemplateOutput = (): TemplateV2 => ({
  name: randomHexString(),
  description: randomHexString(),
  properties: {
    shippingInfo: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
      },
    },
  },
  outputs: {
    subject: 'Order for Mr {{ @data.shippingInfo.lastname }}',
    body: 'Hey Mr {{ @data.shippingInfo.lastname }},',
  },
  id: '5d120f89d601800005728bea',
  creationTimestamp: new Date(1508762564480),
  updateTimestamp: new Date(1508762244460),
});
