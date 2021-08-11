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
  /**
   * Request a list of dispatchers
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Dispatcher>
   */
  find: (options?: OptionsWithRql) => Promise<PagedResult<Dispatcher>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById: (id: ObjectId, options?: OptionsWithRql) => Promise<Dispatcher>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Dispatcher>;
  /**
   * Create a dispatcher
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param requestBody Dispatcher
   * @returns Dispatcher
   */
  create(requestBody: Dispatcher, options?: OptionsBase): Promise<Dispatcher>;
  /**
   * Delete a dispatcher
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_DISPATCHERS` | `global` | **Required** for this endpoint
   * @param dispatcherId The id of the targeted dispatcher
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(
    dispatcherId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
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
