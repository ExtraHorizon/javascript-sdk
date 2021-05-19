import {
  TemplateIn,
  ObjectConfigurationType,
} from '../../src/services/template/types';

import { ConfigurationType } from '../../src/services/data/types';

export const templateInput: TemplateIn = {
  name: 'order_confirm_email',
  description: 'Confirmation email after an order',
  schema: {
    type: ObjectConfigurationType.OBJECT,
    fields: {
      shippingInfo: {
        type: ConfigurationType.OBJECT,
        properties: {
          firstName: {
            type: ConfigurationType.STRING,
          },
          lastName: {
            type: ConfigurationType.STRING,
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
