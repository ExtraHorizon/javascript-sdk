import {
  AffectedRecords,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../../types';
import { Action } from '../types';

export interface DispatchersService {
  /**
   * ## Retrieve a paged list of dispatchers
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
   * ## Create a dispatcher
   *
   * **Global Permissions:**
   * - `CREATE_DISPATCHERS` - Allows a user to create Dispatchers
   *
   * @param requestBody The data used to create the dispatcher
   * @param options - Additional options for the request
   * @returns The created dispatcher {@link Dispatcher}
   */
  create(requestBody: Dispatcher, options?: OptionsBase): Promise<Dispatcher>;

  /**
   * ## Delete a dispatcher
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
  id?: ObjectId;
  eventType: string;
  actions: Array<Action>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}
