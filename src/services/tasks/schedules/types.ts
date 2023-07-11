import {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResultWithPager,
} from '../../types';
import { FindAllIterator } from '../../helpers';

export interface SchedulesService {
  /**
   * ## Create a new Schedule
   *
   * **Global Permissions:**
   * - `CREATE_TASK_SCHEDULE` - Allows a user to create schedules
   *
   * @param schedule - The data used to create the schedule
   * @param options - Additional options for the request
   */
  create<T>(
    schedule: ScheduleCreation<T>,
    options?: OptionsBase
  ): Promise<ScheduleCreation<T>>;

  /**
   * ## Delete a Schedule
   *
   * **Global Permissions:**
   * - `DELETE_TASK_SCHEDULE` - Allows a user to delete schedules
   *
   * @param scheduleId - The id of the schedule to delete
   * @param options - Additional options for the request
   */
  delete(scheduleId: ObjectId, options?: OptionsBase): Promise<AffectedRecords>;

  /**
   * ## Retrieve a paged list of schedules
   *
   * **Global Permissions:**
   * - `VIEW_TASK_SCHEDULES` - Allows a user to view schedules
   *
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns A paged list of schedules {@link PagedResultWithPager PagedResultWithPager<Schedule>}
   */
  find<T>(options?: OptionsWithRql): Promise<PagedResultWithPager<Schedule<T>>>;

  /**
   * ## Retrieve a list of all Schedules
   *
   * **Global Permissions:**
   * - `VIEW_TASK_SCHEDULES` - Allows a user to view schedules
   *
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An array of Schedules {@link Schedule Schedule[]}
   * @throws {@link Error} Do not pass in limit operator with findAll
   */
  findAll<T>(options?: OptionsWithRql): Promise<Schedule<T>[]>;

  /**
   * ## Retrieve a paged list of Schedules
   *
   * **Global Permissions:**
   * - `VIEW_TASK_SCHEDULES` - Allows a user to view Schedules
   *
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An iterator for the queried schedules {@link FindAllIterator FindAllIterator<Schedule>}
   */
  findAllIterator<T>(options?: OptionsWithRql): FindAllIterator<Schedule<T>>;

  /**
   * ## Retrieve the first queried Schedule
   *
   * **Global Permissions:**
   * - `VIEW_TASK_SCHEDULES` - Allows a user to view Schedules
   *
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns The first element of the queried Schedules {@link Schedule}
   */
  findFirst<T>(options?: OptionsWithRql): Promise<Schedule<T>>;
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
  data?: T;
  /** The priority of the schedule (Higher priorities shall execute first) */
  priority?: number;
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
