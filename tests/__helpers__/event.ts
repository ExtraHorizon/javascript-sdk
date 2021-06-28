// import { TemplateIn } from '../../src/services/templates/types';

export const eventInput = {
  type: 'string',
  content: {
    additionalProp1: {},
    additionalProp2: {},
    additionalProp3: {},
  },
};

export const eventData = {
  ...eventInput,
  id: '5bfbfc3146e0fb321rsa4b28',
  creationTimestamp: new Date(),
};

export const eventsResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [eventData],
};
