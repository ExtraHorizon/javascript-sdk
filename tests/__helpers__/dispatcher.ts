import {
  Dispatcher,
  MailActionType,
  TaskActionType,
} from '../../src/services/dispatchers/types';

export const mailAction = {
  id: '5e9fff9d90135a2a9a718e2f',
  type: MailActionType.MAIL,
  recipients: {
    to: ['someone@example.com'],
    cc: ['someone@example.com'],
    bcc: ['someone@example.com'],
  },
  templateId: '5e9fff9d90135a2a9a718e2f',
};

export const taskAction = {
  id: '5e9fff9d90135a2a9a718e2f',
  type: TaskActionType.TASK,
  functionName: 'string',
  data: {
    additionalProp1: 'string',
    additionalProp2: 'string',
    additionalProp3: 'string',
  },
  tags: ['string'],
  startTimestamp: new Date(),
};

export const dispatcherData: Dispatcher = {
  id: '5e9fff9d90135a2a9a718e2f',
  eventType: 'string',
  actions: [mailAction, taskAction],
};

export const dispatchersResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [dispatcherData],
};
