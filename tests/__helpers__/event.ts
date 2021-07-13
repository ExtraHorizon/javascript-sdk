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

export const subscriptionsInput = {
  service: {
    name: 'string',
    version: {
      major: 0,
      minor: 0,
      patch: 0,
    },
  },
  eventTypes: ['string'],
};

export const subscriptionsData = {
  ...subscriptionsInput,
  id: '5bfbfc3146e0fb321rsa4b28',
  creationTimestamp: new Date(),
  updateTimestamp: new Date(),
};
