import { ObjectId } from '../types';
import { TypeConfiguration } from '../data/types';

export interface TemplateOut {
  id?: ObjectId;
  name?: string;
  description?: string;
  schema?: ObjectConfiguration;
  fields?: Record<string, string>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface TemplateIn {
  name: string;
  description: string;
  schema: ObjectConfiguration;
  fields: Record<string, string>;
}

export interface ObjectConfiguration {
  type?: ObjectConfigurationType;
  options?: Array<ObjectOption>;
  fields?: Record<string, TypeConfiguration>;
}

export enum ObjectConfigurationType {
  OBJECT = 'object',
}

export type ObjectOption = ObjectMinBytesOption | ObjectMaxBytesOption;

export interface ObjectMinBytesOption {
  type?: ObjectMinBytesOptionType;
  value: number;
}

export enum ObjectMinBytesOptionType {
  MIN_BYTES = 'min_bytes',
}

export interface ObjectMaxBytesOption {
  type?: ObjectMaxBytesOptionType;
  value: number;
}

export enum ObjectMaxBytesOptionType {
  MAX_BYTES = 'max_bytes',
}

export interface CreateFileBean {
  /**
   * If not present (or empty) we will first check the configured language in the users-service. If that is not present it will default to 'EN'
   */
  language?: string;
  /**
   * If not present (or empty) we will first check the configured time_zone in the users-service. If that is not present it will default to 'Europe/Brussels'
   */
  timeZone?: string;
  content: Record<string, any>;
}
