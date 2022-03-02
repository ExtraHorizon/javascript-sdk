import {
  Notification,
  CreateNotificationRequest,
  NotifTypeDef,
  FieldType,
} from '../../src/services/notifications/types';

export const notificationInput: CreateNotificationRequest = {
  type: 'message',
  userId: '58074804b2148f3b28ad759a',
  fields: {
    title: 'string',
    body: 'string',
  },
  important: true,
};

export const notificationData: Notification = {
  ...notificationInput,
  userId: notificationInput.userId as string,
  viewed: true,
  id: '58074804b2148f3b28ad759a',
  creationTimestamp: new Date(1550577829354),
  updateTimestamp: new Date(1550577829354),
};

export const notificationTypeData: NotifTypeDef = {
  name: 'string',
  requiredFields: {
    additionalProp1: FieldType.STRING,
    additionalProp2: FieldType.STRING,
    additionalProp3: FieldType.STRING,
  },
  optionalFields: {
    additionalProp1: {
      fieldType: FieldType.STRING,
      defaultValue: 'string',
    },
    additionalProp2: {
      fieldType: FieldType.STRING,
      defaultValue: 'string',
    },
    additionalProp3: {
      fieldType: FieldType.STRING,
      defaultValue: 'string',
    },
  },
  title: 'string',
  body: 'string',
  combinedBody: 'string',
  pushByDefault: true,
};

export const settingsInput = {
  key: 'string',
  preferences: {
    additionalProp1: true,
    additionalProp2: true,
    additionalProp3: true,
  },
};

export const settingsData = {
  ...settingsInput,
  id: '58074804b2148f3b28ad759a',
  creationTimestamp: new Date(1550577829354),
  updateTimestamp: new Date(1550577829354),
};
