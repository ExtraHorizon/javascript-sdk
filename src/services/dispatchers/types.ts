import type {
  AffectedRecords,
  MailRecipients,
  ObjectId,
  OptionsBase,
} from '../types';

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

export interface ActionsService {
  /**
   * Add an action to the dispatcher
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param requestBody ActionCreation
   * @returns Action
   */
  create(
    dispatcherId: ObjectId,
    requestBody: ActionCreation,
    options?: OptionsBase
  ): Promise<Action>;
  /**
   * Update an action for the specified dispatcher
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param actionId The id of the targeted action
   * @param requestBody ActionUpdate
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  update(
    dispatcherId: ObjectId,
    actionId: ObjectId,
    requestBody: ActionUpdate,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete an action from the specified dispatcher
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @param actionId The id of the targeted action
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(
    dispatcherId: ObjectId,
    actionId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}
