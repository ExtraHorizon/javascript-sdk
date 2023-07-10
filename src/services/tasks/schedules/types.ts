import { AffectedRecords, ObjectId, OptionsBase } from '../../types';

export interface SchedulesService {
  /**
   * ## Create a new Schedule
   *
   * **Global Permissions:**
   * - `CREATE_TASK_SCHEDULE` - A user may create schedules
   *
   * @param schedule - The data used to create the schedule
   * @param options - Additional options for the request
   */
  create(schedule: ScheduleCreation, options: OptionsBase): Promise<Schedule>;

  /**
   * ## Delete a Schedule
   *
   * **Global Permissions:**
   * - `DELETE_TASK_SCHEDULE` - A user may delete schedules
   *
   * @param scheduleId - The id of the schedule to delete
   * @param options - Additional options for the request
   */
  delete(scheduleId: ObjectId, options: OptionsBase): Promise<AffectedRecords>;
}

export interface Schedule<T = Record<string, string>> {
  id: ObjectId;
  /** The period in seconds, for which the function defined will execute recurrently */
  interval: number;
  /** The functionName property serves as the unique identifier amongst all Functions */
  functionName: string;
  /** The timestamp at which the schedule will start executing */
  startTimestamp: Date;
  /** The timestamp at which the schedule was last updated */
  updateTimestamp: Date;
  /** The timestamp at which the schedule was created */
  creationTimestamp: Date;
  /** The timestamp at which the schedule will next execute */
  nextTimestamp: Date;
  /** The data to be provided to the Function, the type may be user defined */
  data: T;
  /** The priority of the schedule (Higher priorities shall execute first) */
  priority: number;
}

export interface ScheduleCreation<T = Record<string, string>> {
  /** The period in seconds, for which the function defined will execute recurrently */
  interval: number;
  /** The functionName property serves as the unique identifier amongst all Functions */
  functionName: string;
  /** The data to be provided to the Function, the type may be user defined */
  data?: T;
  /** The priority of the schedule (Higher priorities shall execute first) */
  priority?: number;
  /** The timestamp at which the schedule will start executing */
  startTimestamp?: Date;
}
