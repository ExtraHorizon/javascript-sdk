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
  retriable?: boolean;
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

export interface CreateEventOptions extends OptionsBase {
  /**
   * If set to `false`, the `content` of the event will not be normalized, i.e. camelCase keys will be preserved.
   */
  normalizeEventContent?: boolean;
}

export interface EventsService {
  /**
   * Returns a list of events
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_EVENTS` | `global` | **Required** for this endpoint
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Event>>;

  /**
   * Returns a list of events
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_EVENTS` | `global` | **Required** for this endpoint
   */
  findAll(options?: OptionsWithRql): Promise<Event[]>;

  /**
   * Find By Id
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Event | undefined>;

  /**
   * Find First
   */
  findFirst(options?: OptionsWithRql): Promise<Event | undefined>;

  /**
   * Creates an event
   *
   * **Note**: The `content` of the event will be normalized by default, i.e. all keys will be converted to snake_case.
   * Use `normalizeEventContent: false` to preserve camelCase keys.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_EVENTS` | `global` | **Required** for this endpoint
   */
  create(requestBody: CreateEvent, options?: CreateEventOptions): Promise<Event>;

  /**
   * Perform a health check
   */
  health(): Promise<boolean>;
}

export interface SubscriptionsService {
  /**
   * Returns a list of event subscriptions
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Subscription>>;

  /**
   * Returns a list of event subscriptions
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   */
  findAll(options?: OptionsWithRql): Promise<Subscription[]>;

  /**
   * Find By Id
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Subscription | undefined>;

  /**
   * Find First
   */
  findFirst(options?: OptionsWithRql): Promise<Subscription | undefined>;

  /**
   * @deprecated Should not be used, services manage subscriptions themselves
   *
   * Creates an event subscription
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SUBSCRIPTIONS` | `global` | **Required** for this endpoint
   */
  create(
    requestBody: CreateSubscription,
    options?: OptionsBase
  ): Promise<Subscription>;
}
