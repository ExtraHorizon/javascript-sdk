import {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../../types';
import { Action } from '../actions/types';

export interface DispatchersService {
  /**
   * ## Retrieve a paged list of Dispatchers
   *
   * **Global Permissions:**
   * - `VIEW_DISPATCHERS` - Allows a user to view Dispatchers
   *
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns A paged list of Dispatchers {@link PagedResultWithPager PagedResultWithPager<Dispatcher>}
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Dispatcher>>;

  /**
   * ## Retrieve a Dispatcher by id
   *
   * **Global Permissions:**
   * - `VIEW_DISPATCHERS` - Allows a user to view Dispatchers
   *
   * @param id {@link ObjectId} - The id of the targeted Dispatcher
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns The first element of the queried Dispatchers {@link Dispatcher}
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Dispatcher>;

  /**
   * ## Retrieve the first queried Dispatcher
   *
   * **Global Permissions:**
   * - `VIEW_DISPATCHERS` - Allows a user to view Dispatchers
   *
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns The first element of the queried Dispatchers {@link Dispatcher}
   */
  findFirst(options?: OptionsWithRql): Promise<Dispatcher>;

  /**
   * ## Create a Dispatcher
   *
   * **Global Permissions:**
   * - `CREATE_DISPATCHERS` - Allows a user to create Dispatchers
   *
   * @param requestBody The data used to create the Dispatcher {@link DispatcherCreation}
   * @param options - Additional options for the request
   * @returns The created Dispatcher {@link Dispatcher}
   */
  create(
    requestBody: DispatcherCreation,
    options?: OptionsBase
  ): Promise<Dispatcher>;

  /**
   * ## Update a Dispatcher
   *
   * **Global Permissions:**
   * - `UPDATE_DISPATCHERS` - Allows a user to update Dispatchers
   *
   * @param dispatcherId {@link ObjectId} The id of the Dispatcher to be updated
   * @param requestBody The data used to update the Dispatcher {@link DispatcherUpdate}
   * @param options - Additional options for the request
   * @returns An affected records response {@link AffectedRecords}
   */
  update(
    dispatcherId: ObjectId,
    requestBody: DispatcherUpdate,
    options?: OptionsBase
  ): Promise<AffectedRecords>;

  /**
   * ## Delete a Dispatcher
   *
   * **Global Permissions:**
   * - `DELETE_DISPATCHERS` - Allows a user to delete Dispatchers
   *
   * @param dispatcherId {@link ObjectId} The id of the Dispatcher to be deleted
   * @param options - Additional options for the request
   * @returns An affected records response {@link AffectedRecords}
   */
  remove(
    dispatcherId: ObjectId,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface Dispatcher {
  id: ObjectId;
  /** The unique name of the dispatcher */
  name?: string;
  /** A description of the dispatcher */
  description?: string;
  /** The type of event the Dispatcher will respond to e.g 'user_deleted' */
  eventType: string;
  /** The actions the Dispatcher shall execute */
  actions: Array<Action>;
  /** A list of string identifiers that can be attached to a Dispatcher */
  tags?: Array<string>;
  /** The creation timestamp of the Dispatcher */
  creationTimestamp: Date;
  /** The update timestamp of the Dispatcher */
  updateTimestamp: Date;
}

export type DispatcherCreation = Omit<
  Dispatcher,
  'id' | 'creationTimestamp' | 'updateTimestamp'
>;
export type DispatcherUpdate = Partial<
  Omit<Dispatcher, 'id' | 'actions' | 'creationTimestamp' | 'updateTimestamp'>
>;
