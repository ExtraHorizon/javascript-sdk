import { FindAllIterator } from '../../services/helpers';
import type {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';

export enum TaskStatus {
  NEW = 'new',
  IN_PROGRESS = 'inProgress',
  COMPLETE = 'complete',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export interface Task {
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
  data?: any;
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
}
