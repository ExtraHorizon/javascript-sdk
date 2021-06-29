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
  creation_timestamp: 1508762564480,
  update_timestamp: 1508762244460,
};

export const templateResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [templateData],
};
