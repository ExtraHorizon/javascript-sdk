import type { MailRecipients, ObjectId } from "../types";

export interface Dispatcher {
  id?: ObjectId;
  eventType: string;
  actions: Array<Action>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

interface ActionBase {
  id?: ObjectId;
  type?: ActionType;
}

export enum ActionType {
  MAIL = "mail",
  TASK = "task",
}

export interface MailAction extends ActionBase {
  type?: ActionType.MAIL;
  recipients?: MailRecipients;
  templateId?: ObjectId;
}

export interface TaskAction extends ActionBase {
  type?: ActionType.TASK;
  functionName?: string;
  data?: Record<string, string>;
  tags?: Array<string>;
  startTimestamp?: Date;
}

export type Action = MailAction | TaskAction;

export type ActionCreation = MailActionCreation | TaskActionCreation;

export interface MailActionCreation {
  type?: ActionType.MAIL;
  recipients: MailRecipients;
  templateId: ObjectId;
}

export interface TaskActionCreation {
  type?: ActionType.TASK;
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
