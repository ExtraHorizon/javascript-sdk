import {
  AffectedRecords,
  MailRecipients,
  ObjectId,
  OptionsBase,
} from '../../types';

export interface ActionsService {
  /**
   * ## Create an Action for a Dispatcher
   *
   * **Global Permissions:**
   * - `UPDATE_DISPATCHERS` - Allows a user to update Dispatchers
   *
   * @param dispatcherId {@link ObjectId} The id of the Dispatcher to be updated
   * @param requestBody The data used to create the Action {@link ActionCreation}
   * @param options - Additional options for the request
   * @returns The created Action {@link Action}
   */
  create(
    dispatcherId: ObjectId,
    requestBody: ActionCreation,
    options?: OptionsBase
  ): Promise<Action>;

  /**
   * ## Update an Action of a Dispatcher
   *
   * **Global Permissions:**
   * - `UPDATE_DISPATCHERS` - Allows a user to update Dispatchers
   *
   * @param dispatcherId {@link ObjectId} The id of the Dispatcher to be updated
   * @param actionId {@link ObjectId} The id of the Action to be updated
   * @param requestBody The data used to update the Action {@link ActionUpdate}
   * @param options - Additional options for the request
   * @returns An affected records response {@link AffectedRecords}
   */
  update(
    dispatcherId: ObjectId,
    actionId: ObjectId,
    requestBody: ActionUpdate,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * ## Remove an Action from a Dispatcher
   *
   * **Global Permissions:**
   * - `UPDATE_DISPATCHERS` - Allows a user to update Dispatchers
   *
   * @param dispatcherId {@link ObjectId} The id of the Dispatcher to remove an Action from
   * @param actionId {@link ObjectId} The id of the Action to be removed
   * @param options - Additional options for the request
   * @returns An affected records response {@link AffectedRecords}
   */
  remove(
    dispatcherId: ObjectId,
    actionId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export enum ActionType {
  MAIL = 'mail',
  TASK = 'task',
}

export interface ActionBase {
  id?: ObjectId;
  /** The unique name of the dispatcher */
  name?: string;
  /** A description of the dispatcher */
  description?: string;
  /** The type of event the Dispatcher will respond to e.g 'user_deleted' */
}
export interface MailAction extends ActionBase {
  /** The type of Action the Dispatcher will execute */
  type?: ActionType.MAIL;
  /** The recipients list of the mail, including to, cc and bcc  */
  recipients?: MailRecipients;
  /** The id of the mail template to be consumed */
  templateId?: ObjectId;
}

export interface TaskAction extends ActionBase {
  /** The type of Action the Dispatcher will execute */
  type?: ActionType.TASK;
  /** The name of the Function to be executed as a task */
  functionName?: string;
  /** The data to be sent to the Function, the type may be specified by the user */
  data?: Record<string, string>;
  /** A list of string identifiers that can be attached to a task */
  tags?: Array<string>;
  /** The start timestamp of the task */
  startTimestamp?: Date;
}

export type Action = MailAction | TaskAction;

export type MailActionCreation = Omit<MailAction, 'id'>;
export type TaskActionCreation = Omit<TaskAction, 'id'>;

export type ActionCreation = MailActionCreation | TaskActionCreation;

export type MailActionUpdate = Partial<Omit<MailAction, 'id' | 'type'>>;
export type TaskActionUpdate = Partial<Omit<TaskAction, 'id' | 'type'>>;

export type ActionUpdate = MailActionUpdate | TaskActionUpdate;
