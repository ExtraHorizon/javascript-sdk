import type { ObjectId } from '../types';

export interface Dispatcher {
  id?: ObjectId;
  eventType: string;
  actions: Array<Action>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export type Action = MailAction | TaskAction;

export interface MailAction {
  id?: ObjectId;
  type?: MailActionType;
  recipients?: MailRecipients;
  templateId?: ObjectId;
}

export enum MailActionType {
  MAIL = 'mail',
}

export type MailRecipients = {
  to?: MailList;
  cc?: MailList;
  bcc?: MailList;
};

export type MailList = Array<MailAddress>;

export type MailAddress = string;

export interface TaskAction {
  id?: ObjectId;
  type?: TaskActionType;
  functionName?: string;
  data?: Record<string, string>;
  tags?: Array<string>;
  startTimestamp?: Date;
}

export enum TaskActionType {
  TASK = 'task',
}

export type ActionCreation = MailActionCreation | TaskActionCreation;

export interface MailActionCreation {
  type: MailActionType;
  recipients: MailRecipients;
  templateId: ObjectId;
}

export interface TaskActionCreation {
  type: TaskActionType;
  functionName: string;
  data?: Record<string, string>;
  tags?: Array<string>;
  startTimestamp?: Date;
}

export type ActionUpdate = MailActionUpdate | TaskActionUpdate;

export interface MailActionUpdate {
  recipients?: MailRecipients;
  templateId?: ObjectId;
}

export interface TaskActionUpdate {
  functionName?: string;
  data?: Record<string, string>;
  tags?: Array<string>;
  startTimestamp?: Date;
}
