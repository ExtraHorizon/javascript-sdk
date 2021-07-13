import { TemplateIn } from '../../src/services/templates/types';

export const templateInput: TemplateIn = {
  name: 'order_confirm_email',
  description: 'Confirmation email after an order',
  schema: {
    type: 'object',
    fields: {
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
  },
  fields: {
    subject: 'Order for Mr $shippinginfo.lastname',
    body: 'Hey Mr $shippinginfo.lastname,',
  },
};

export const templateData = {
  ...templateInput,
  id: '5d120f89d601800005728bea',
  creationTimestamp: new Date(1508762564480),
  updateTimestamp: new Date(1508762244460),
};
