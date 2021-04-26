import { ObjectId } from '../models/ObjectId';
import { PagedResult } from '../models/Responses';

// TODO check with Jens if we want to transform these fields too
type Timestamp = string;

export enum TaskStatus {
  NEW = 'new',
  IN_PROGRESS = 'inProgress',
  COMPLETE = 'complete',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export interface TasksList extends PagedResult {
  data: Array<Task>;
}

export type Task = {
  id?: ObjectId;
  status?: TaskStatus;
  statusChangedTimestamp?: Timestamp;
  /**
   * AWS Lambda function name
   */
  functionName: string;
  /**
   * Data send to the function
   */
  data?: any;
  startTimestamp?: Timestamp;
  tags?: Array<string>;
  priority?: number;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
};

export type TaskInput = Pick<
  Task,
  'functionName' | 'data' | 'startTimestamp' | 'priority' | 'tags'
>;
