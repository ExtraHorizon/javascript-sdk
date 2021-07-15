import { RQLString } from '../../rql';
import type { AffectedRecords, ObjectId, PagedResult } from '../types';

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
  find(
    this: TasksService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Task>>;
  findById(
    this: TasksService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Task>;
  findFirst(this: TasksService, options?: { rql?: RQLString }): Promise<Task>;
  create(this: TasksService, requestBody: TaskInput): Promise<Task>;
  cancel(this: TasksService, taskId: ObjectId): Promise<AffectedRecords>;
}
