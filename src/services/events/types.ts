import {
  Entity,
  ObjectId,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
  Timestamps,
} from '../types';

export interface CreateEvent {
  type: string;
  content?: Record<string, any>;
}

export type Event = CreateEvent & Entity & Timestamps;

export interface CreateSubscription {
  service: Service;
  eventTypes: Array<string>;
}

export type Subscription = CreateSubscription & Entity & Timestamps;

export interface Service {
  name: string;
  version: Version;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface EventsService {
  /**
   * Returns a list of events
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_EVENTS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Event>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Event>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Event>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Event>;
  /**
   * Creates an event
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_EVENTS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Event
   */
  create(requestBody: CreateEvent, options?: OptionsBase): Promise<Event>;
}

export interface SubscriptionsService {
  /**
   * Returns a list of event subscriptions
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Subscription>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Subscription>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Subscription>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Subscription>;
  /**
   * Creates an event subscription
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Subscription
   */
  create(
    requestBody: CreateSubscription,
    options?: OptionsBase
  ): Promise<Subscription>;
}
