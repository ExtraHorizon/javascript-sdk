import { ObjectId, OptionsWithRql } from '../../types';

export interface LogsService {
  /**
   * ## Retrieve a list of logs for a task
   *
   * **Global Permissions:**
   * - `VIEW_TASK_LOGS` - **Required** for this endpoint
   *
   * @param taskId {@link string} The id of the targeted task
   * @param options {@link OptionsWithRql} - Additional options for the request
   * @returns An array of task logs {@link TaskLog TaskLog[]}
   */
  find(taskId: ObjectId, options?: OptionsWithRql): Promise<TaskLog[]>;

  /**
   * ## Retrieve the first queried task log
   *
   * **Global Permissions:**
   * - `VIEW_TASK_LOGS` - **Required** for this endpoint
   *
   * @param taskId {@link string} The id of the targeted task
   * @param options {@link OptionsWithRql} - Additional options for the request
   * @returns The first element of the queried task logs {@link TaskLog}     */
  findFirst(taskId: ObjectId, options?: OptionsWithRql): Promise<TaskLog>;
}

export interface TaskLog {
  // The message logged at the time of the event
  message: string;
  // The timestamp on which the logged event occurred
  timestamp: Date;
}
