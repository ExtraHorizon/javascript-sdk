import { RQLString } from '../../rql';
import type {
  AffectedRecords,
  MailRecipients,
  ObjectId,
  PagedResult,
} from '../types';

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
  MAIL = 'mail',
  TASK = 'task',
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

export interface DispatchersService {
  find: (
    this: DispatchersService,
    options?: { rql?: RQLString }
  ) => Promise<PagedResult<Dispatcher>>;
  findById: (
    this: DispatchersService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ) => Promise<Dispatcher>;
  findFirst(options?: { rql?: RQLString }): Promise<Dispatcher>;
  create(requestBody: Dispatcher): Promise<Dispatcher>;
  remove(dispatcherId: ObjectId): Promise<AffectedRecords>;
}

export interface ActionsService {
  create(dispatcherId: ObjectId, requestBody: ActionCreation): Promise<Action>;
  update(
    dispatcherId: ObjectId,
    actionId: ObjectId,
    requestBody: ActionUpdate
  ): Promise<AffectedRecords>;
  delete(dispatcherId: ObjectId, actionId: ObjectId): Promise<AffectedRecords>;
}
