import { RQLString } from '../../rql';
import { Entity, ObjectId, PagedResult, Timestamps } from '../types';

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
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_EVENTS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Event>
   */
  find(
    this: EventsService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Event>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(
    this: EventsService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Event>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(this: EventsService, options?: { rql?: RQLString }): Promise<Event>;
  /**
   * Creates an event
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_EVENTS` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns Event
   */
  create(this: EventsService, requestBody: CreateEvent): Promise<Event>;
}

export interface SubscriptionsService {
  /**
   * Returns a list of event subscriptions
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Subscription>
   */
  find(
    this: SubscriptionsService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Subscription>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(
    this: SubscriptionsService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Subscription>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(
    this: SubscriptionsService,
    options?: { rql?: RQLString }
  ): Promise<Subscription>;
  /**
   * Creates an event subscription
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns Subscription
   */
  create(
    this: SubscriptionsService,
    requestBody: CreateSubscription
  ): Promise<Subscription>;
}
