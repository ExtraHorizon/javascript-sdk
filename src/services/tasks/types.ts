import { FindAllIterator } from '../../services/helpers';
import type {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';
import { ApiService } from './api/types';
import { LogsService } from './logs/types';

export enum TaskStatus {
  NEW = 'new',
  IN_PROGRESS = 'inProgress',
  COMPLETE = 'complete',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export interface Task<DataType = any> {
  id?: ObjectId;
  status?: TaskStatus;
  statusChangedTimestamp?: Date;
  /**
   * AWS Lambda function name
   */
  functionName: string;
  /**
   * Data send to the function
   */
  data?: DataType;
  startTimestamp?: Date;
  tags?: Array<string>;
  priority?: number;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export type TaskInput = Pick<
  Task,
  'functionName' | 'data' | 'startTimestamp' | 'priority' | 'tags'
>;

export interface DirectExecutionResponse<T, U> extends Task<U> {
  /** The Extra Horizon document id for the application used to make the request */
  createdByApplicationId?: ObjectId;
  /** The Extra Horizon document id for the user who made the request */
  createdByUserId?: ObjectId;
  /** The result of the Function execution, this may be user defined */
  result: T;
}

export interface TasksService {
  /**
   * View a list of tasks
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TASKS` | `gobal` | **Required** for this endpoint
   * @returns PagedResult<Task>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Task>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Task>;
  /**
   * Request a list of all tasks
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TASKS` | `gobal` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns Task[]
   */
  findAll(options?: OptionsWithRql): Promise<Task[]>;
  /**
   * Request a list of all tasks
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TASKS` | `gobal` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns Task[]
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<Task>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Task>;
  /**
   * Create a task
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TASKS` | `gobal` | **Required** for this endpoint
   * @param requestBody
   * @returns Task Success
   */
  create(requestBody: TaskInput, options?: OptionsBase): Promise<Task>;
  /**
   * Cancel a task
   *
   * The targeted task **MUST** be in the `new` status.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CANCEL_TASKS` | `gobal` | **Required** for this endpoint
   * @param taskId The id of the targeted task
   * @returns AffectedRecords
   * @throws {IllegalStateException}
   * @throws {ResourceUnknownException}
   */
  cancel(taskId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * ## Execute a Function directly
   *
   * A Function may be executed directly, the function will be executed synchronously and the response may be awaited by the caller.
   *
   * **Default Permissions:**
   * - Any party may execute Functions with the `public` permission mode
   * - Any authenticated user may execute Functions with the `allUsers` permission mode
   *
   * **Global Permissions:**
   * - `EXECUTE_TASK_FUNCTION` - A user may execute all Functions
   * - `EXECUTE_TASK_FUNCTION:{FUNCTION_NAME}` - A user may execute the Function specified by the FUNCTION_NAME
   *
   * @param functionName {@link string} - The functionName property serves as the unique identifier amongst all Functions
   * @param data {@link U} - The data to be sent to the Function, the type may be user defined
   * @param options {@link OptionsBase} - Additional options for the request
   * @returns {@link DirectExecutionResponse} - The response returned from the Function, the response data and results may be user defined
   */
  execute<T = any, U = any>(
    functionName: string,
    data: U,
    options?: OptionsBase
  ): Promise<DirectExecutionResponse<T, U>>;

  api: ApiService;
  logs: LogsService;
}
