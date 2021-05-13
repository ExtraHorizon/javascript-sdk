import type { ObjectId, PagedResult } from '../types';

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
