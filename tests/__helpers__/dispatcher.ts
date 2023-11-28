import { Dispatcher } from '../../src/services/dispatchers/dispatchers/types';
import {
  ActionCreation,
  ActionType,
} from '../../src/services/dispatchers/types';

export const mailAction = {
  id: '5e9fff9d90135a2a9a718e2f',
  name: 'no subject',
  description: 'You have got mail!',
  type: ActionType.MAIL,
  recipients: {
    to: ['someone@example.com'],
    cc: ['someone@example.com'],
    bcc: ['someone@example.com'],
  },
  templateId: '5e9fff9d90135a2a9a718e2f',
};

export const mailActionInput: ActionCreation = {
  name: 'no subject',
  description: 'You have got mail!',
  type: ActionType.MAIL,
  recipients: {
    to: ['someone@example.com'],
  },
  templateId: '5e9fff9d90135a2a9a718e2f',
};

export const taskActionInput: ActionCreation = {
  name: 'TaskAction',
  description: 'Do this now!',
  type: ActionType.TASK,
  functionName: 'string',
  data: {
    additionalProp1: 'string',
    additionalProp2: 'string',
    additionalProp3: 'string',
    additional_prop_four: 'string',
  },
  tags: ['string'],
  startTimestamp: new Date(),
};

export const taskAction = {
  id: '5e9fff9d90135a2a9a718e2f',
  name: 'TaskAction',
  description: 'Do this now!',
  type: ActionType.TASK,
  functionName: 'string',
  data: {
    additionalProp1: 'string',
    additionalProp2: 'string',
    additionalProp3: 'string',
    additional_prop_four: 'string',
  },
  tags: ['string'],
  startTimestamp: new Date(),
};

export const dispatcherData: Dispatcher = {
  id: '5e9fff9d90135a2a9a718e2f',
  name: 'DispatcherName',
  description: 'Dispatch!',
  eventType: 'string',
  actions: [mailAction, taskAction],
  updateTimestamp: new Date(),
  creationTimestamp: new Date(),
};
