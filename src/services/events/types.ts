import { ObjectId } from '../types';
// import { TypeConfiguration } from '../data/types';

export interface CreateEvent {
  type: string;
  content?: Record<string, any>;
}

export interface Subscription {
  id?: ObjectId;
  service?: Service;
  eventTypes?: Array<string>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface Service {
  name: string;
  version: Version;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface CreateSubscription {
  service: Service;
  eventTypes: Array<string>;
}
