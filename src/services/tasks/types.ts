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
  /** The Extra Horizon document id for the application used to make the request */
  createdByApplicationId?: ObjectId;
  /** The Extra Horizon document id for the user who made the request */
  createdByUserId?: ObjectId;
}

export type TaskInput = Pick<
  Task,
  'functionName' | 'data' | 'startTimestamp' | 'priority' | 'tags'
>;

export interface DirectExecutionResponse<T, U> extends Task<U> {
  /** The result of the Function execution, this may be user defined */
  result: T;
}

export enum ApiFunctionRequestMethod {
  'GET' = 'GET',
  'POST' = 'POST',
  'PUT' = 'PUT',
  'DELETE' = 'DELETE',
  'PATCH' = 'PATCH',
  'OPTIONS' = 'OPTIONS',
  'HEAD' = 'HEAD',
}

export interface ApiFunctionRequestObject {
  /** The payload formation version of the AWS API Gateway. */
  version: '2.0';
  /** The path portion of the URL that comes after the Function name. */
  rawPath: string;
  /** The unprocessed query string of the incoming HTTP request including the starting question mark. */
  rawQueryString: string;
  /**
   * The headers of the incoming HTTP request.
   * It is structured as an object, where each key-value pair corresponds to a header name and its value.
   * */
  headers: Record<string, string>;
  requestContext: {
    http: {
      /**  The HTTP method used to target the API function. */
      method: ApiFunctionRequestMethod;
    };
  };
  /** The body of the incoming HTTP request as string. It can be Base64-encoded based on the isBase64Encoded property. */
  body: string;
  /** The isBase64Encoded property indicates if the body property of the request object has been Base64-encoded. */
  isBase64Encoded: boolean;
}

export interface ApiFunctionResponseObject {
  /**
   * The statusCode field resolves to the status code in the HTTP response.
   * The value can be in the 200 - 499 range.
   * */
  statusCode: number;
  /**
   * The headers field resolves to the headers in the HTTP response.
   * It is structured as an object, where each key-value pair corresponds to a header name and its value.
   * */
  headers?: Record<string, string>;
  /**
   * The body field resolves to the body in the HTTP response.
   * In order to include binary data within a body, such as images or audio files, it is necessary to convert it into a Base64 string and assign it to the body field of the response object. Additionally, the isBase64Encoded field must be set to true.
   * If the response body does not contain binary data, you can directly include the data in its original format.
   */
  body?: string;
  /**
   * The isBase64Encoded field must be set to true if the body field of the response object is a Base64 encoded string representing the raw response body.
   * */
  isBase64Encoded?: boolean;
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
   * @param data {@link U} - The data to be sent to the Function, the type may be specified by the user
   * @param options {@link OptionsBase} - Additional options for the request
   * @returns {@link DirectExecutionResponse} - The response returned from the Function, the response data and results may be user defined
   */
  execute<T = any, U = any>(
    functionName: string,
    data?: U,
    options?: OptionsBase
  ): Promise<DirectExecutionResponse<T, U>>;

  api: ApiService;
  logs: LogsService;
}
