export const dispatcherData = {
  id: '5e9fff9d90135a2a9a718e2f',
  eventType: 'string',
  actions: [
    {
      id: '5e9fff9d90135a2a9a718e2f',
      type: 'mail',
      recipients: {
        to: ['someone@example.com'],
        cc: ['someone@example.com'],
        bcc: ['someone@example.com'],
      },
      templateId: '5e9fff9d90135a2a9a718e2f',
    },
    {
      id: '5e9fff9d90135a2a9a718e2f',
      type: 'task',
      functionName: 'string',
      data: {
        additionalProp1: 'string',
        additionalProp2: 'string',
        additionalProp3: 'string',
      },
      tags: ['string'],
      startTimestamp: '2021-05-25T20:01:36.473Z',
    },
  ],
  creationTimestamp: 0,
  updateTimestamp: 0,
};

export const dispatchersResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [dispatcherData],
};
