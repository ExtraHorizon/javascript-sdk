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

export interface CreateNotificationRequest {
  userId?: ObjectId;
  type?: CreateNotificationRequestType;
  fields?: Record<string, string>;
  important?: boolean;
}

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
