import {
  TemplateIn,
  ObjectConfigurationType,
} from '../../src/services/template/types';

export const templateData = {
  id: '5d120f89d601800005728bea',
  name: 'order_confirm_email',
  description: 'Confirmation email after an order',
  schema: {
    type: 'object',
    fields: {
      shippingInfo: {
        type: 'object',
        fields: {
          first_name: {
            type: 'string',
          },
          last_name: {
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
  creation_timestamp: 1508762564480,
  update_timestamp: 1508762244460,
};

export const templateResponse = {
  query: '{}',
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [templateData],
};

export const templateInput: TemplateIn = {
  name: 'order_confirm_email',
  description: 'Confirmation email after an order',
  schema: {
    type: ObjectConfigurationType.OBJECT,
    fields: {
      shippingInfo: {
        type: 'object',
        fields: {
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
