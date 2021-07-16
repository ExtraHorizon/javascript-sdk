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
  find(
    this: EventsService,
    options?: OptionsWithRql
  ): Promise<PagedResult<Event>>;
  findById(
    this: EventsService,
    id: ObjectId,
    options?: OptionsWithRql
  ): Promise<Event>;
  findFirst(this: EventsService, options?: OptionsWithRql): Promise<Event>;
  create(
    this: EventsService,
    requestBody: CreateEvent,
    options: OptionsBase
  ): Promise<Event>;
}

export interface SubscriptionsService {
  find(
    this: SubscriptionsService,
    options?: OptionsWithRql
  ): Promise<PagedResult<Subscription>>;
  findById(
    this: SubscriptionsService,
    id: ObjectId,
    options?: OptionsWithRql
  ): Promise<Subscription>;
  findFirst(
    this: SubscriptionsService,
    options?: OptionsWithRql
  ): Promise<Subscription>;
  create(
    this: SubscriptionsService,
    requestBody: CreateSubscription,
    options?: OptionsBase
  ): Promise<Subscription>;
}
