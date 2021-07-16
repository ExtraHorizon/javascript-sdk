import { RQLString } from '../../rql';
import type {
  AffectedRecords,
  MailRecipients,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
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
    options?: OptionsWithRql
  ) => Promise<PagedResult<Dispatcher>>;
  findById: (
    this: DispatchersService,
    id: ObjectId,
    options?: OptionsWithRql
  ) => Promise<Dispatcher>;
  findFirst(
    this: DispatchersService,
    options?: OptionsWithRql
  ): Promise<Dispatcher>;
  create(
    this: DispatchersService,
    requestBody: Dispatcher,
    options?: OptionsBase
  ): Promise<Dispatcher>;
  remove(
    this: DispatchersService,
    dispatcherId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface ActionsService {
  create(
    this: DispatchersService,
    dispatcherId: ObjectId,
    requestBody: ActionCreation,
    options?: OptionsBase
  ): Promise<Action>;
  update(
    this: DispatchersService,
    dispatcherId: ObjectId,
    actionId: ObjectId,
    requestBody: ActionUpdate,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  remove(
    this: DispatchersService,
    dispatcherId: ObjectId,
    actionId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}
