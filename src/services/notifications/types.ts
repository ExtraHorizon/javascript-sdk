import { ObjectId } from '../types';

export interface Notification {
  id?: ObjectId;
  type?: string;
  viewed?: boolean;
  userId?: ObjectId;
  fields?: Record<string, string>;
  important?: boolean;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

interface CreateNotificationRequestBase {
  userId?: ObjectId;
  type?: CreateNotificationRequestType;
  important?: boolean;
}

interface CreateNotificationRequestMessage
  extends CreateNotificationRequestBase {
  type: CreateNotificationRequestType.MESSAGE;
  fields: {
    title: string;
    body: string;
    senderId: ObjectId;
  };
}

interface CreateNotificationRequestLink extends CreateNotificationRequestBase {
  type: CreateNotificationRequestType.LINK;
  fields: {
    title: string;
    body: string;
    url: string;
  };
}

interface CreateNotificationRequestMeasurementComment
  extends CreateNotificationRequestBase {
  type: CreateNotificationRequestType.MEASUREMENT_COMMENT;
  fields: {
    commenterId: ObjectId;
    measurementId: ObjectId;
  };
}

interface CreateNotificationRequestMeasurementReviewed
  extends CreateNotificationRequestBase {
  type: CreateNotificationRequestType.MEASUREMENT_REVIEWED;
  fields: {
    measurementId: ObjectId;
  };
}

interface CreateNotificationRequestMeasurementPrescriptionExpiry
  extends CreateNotificationRequestBase {
  type: CreateNotificationRequestType.MEASUREMENT_REVIEWED;
  fields: {
    groupId: ObjectId;
    groupName: string;
  };
}

interface CreateNotificationRequestActivated
  extends CreateNotificationRequestBase {
  type: CreateNotificationRequestType.ACTIVATED;
}

interface CreateNotificationRequestPasswordChanged
  extends CreateNotificationRequestBase {
  type: CreateNotificationRequestType.PASSWORD_CHANGED;
}

export type CreateNotificationRequest =
  | CreateNotificationRequestMessage
  | CreateNotificationRequestLink
  | CreateNotificationRequestMeasurementComment
  | CreateNotificationRequestMeasurementReviewed
  | CreateNotificationRequestMeasurementPrescriptionExpiry
  | CreateNotificationRequestActivated
  | CreateNotificationRequestPasswordChanged;

export enum CreateNotificationRequestType {
  PASSWORD_CHANGED = 'password_changed',
  ACTIVATED = 'activated',
  PRESCRIPTION_EXPIRY = 'prescription_expiry',
  MEASUREMENT_COMMENT = 'measurement_comment',
  MEASUREMENT_REVIEWED = 'measurement_reviewed',
  MESSAGE = 'message',
  LINK = 'link',
}

export interface NotifTypeDef {
  name?: string;
  requiredFields?: Record<string, FieldType>;
  optionalFields?: Record<
    string,
    {
      fieldType?: FieldType;
      defaultValue?: string;
    }
  >;
  title?: string;
  body?: string;
  combinedBody?: string;
  pushByDefault?: boolean;
}

export enum FieldType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OBJECT_ID = 'OBJECT_ID',
  URL = 'URL',
}

export interface Setting {
  id?: ObjectId;
  key?: string;
  preferences?: Record<string, boolean>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export type SettingCreation = Required<Pick<Setting, 'key' | 'preferences'>>;
