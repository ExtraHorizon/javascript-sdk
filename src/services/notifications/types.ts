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
  important?: boolean;
}

interface CreateNotificationRequestMessage
  extends CreateNotificationRequestBase {
  type: 'message';
  fields: {
    title: string;
    body: string;
  };
}

interface CreateNotificationRequestLink extends CreateNotificationRequestBase {
  type: 'link';
  fields: {
    title: string;
    body: string;
    url: string;
  };
}

interface CreateNotificationRequestMeasurementComment
  extends CreateNotificationRequestBase {
  type: 'measurement_comment';
  fields: {
    commenterId: ObjectId;
    measurementId: ObjectId;
  };
}

interface CreateNotificationRequestMeasurementReviewed
  extends CreateNotificationRequestBase {
  type: 'measurement_reviewed';
  fields: {
    measurementId: ObjectId;
  };
}

interface CreateNotificationRequestMeasurementPrescriptionExpiry
  extends CreateNotificationRequestBase {
  type: 'prescription_expiry';
  fields: {
    groupId: ObjectId;
    groupName: string;
  };
}

interface CreateNotificationRequestActivated
  extends CreateNotificationRequestBase {
  type: 'activated';
}

interface CreateNotificationRequestPasswordChanged
  extends CreateNotificationRequestBase {
  type: 'password_changed';
}

export type CreateNotificationRequest =
  | CreateNotificationRequestMessage
  | CreateNotificationRequestLink
  | CreateNotificationRequestMeasurementComment
  | CreateNotificationRequestMeasurementReviewed
  | CreateNotificationRequestMeasurementPrescriptionExpiry
  | CreateNotificationRequestActivated
  | CreateNotificationRequestPasswordChanged;

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
