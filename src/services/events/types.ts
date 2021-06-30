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
  find(
    this: EventsService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Event>>;
  findById(
    this: EventsService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Event>;
  findFirst(this: EventsService, options?: { rql?: RQLString }): Promise<Event>;
  create(this: EventsService, requestBody: CreateEvent): Promise<Event>;
}

export interface SubscriptionsService {
  find(
    this: SubscriptionsService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Subscription>>;
  findById(
    this: SubscriptionsService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<Subscription>;
  findFirst(
    this: SubscriptionsService,
    options?: { rql?: RQLString }
  ): Promise<Subscription>;
  create(
    this: SubscriptionsService,
    requestBody: CreateSubscription
  ): Promise<Subscription>;
}
