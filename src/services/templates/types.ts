import { ObjectId, LanguageCode, TimeZone } from '../types';
import { TypeConfiguration } from '../data/types';

export interface TemplateOut {
  id?: ObjectId;
  name?: string;
  description?: string;
  schema?: TemplateObjectConfiguration;
  fields?: Record<string, string>;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface TemplateIn {
  name: string;
  description: string;
  schema: TemplateObjectConfiguration;
  fields: Record<string, string>;
}

export interface TemplateObjectConfiguration {
  type?: 'object';
  options?: Array<ObjectOption>;
  fields?: Record<string, TypeConfiguration>;
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

export interface CreateFile {
  /**
   * If not present (or empty) we will first check the configured language in the users-service. If that is not present it will default to 'EN'
   */
  language?: LanguageCode;
  /**
   * If not present (or empty) we will first check the configured time_zone in the users-service. If that is not present it will default to 'Europe/Brussels'
   */
  timeZone?: TimeZone;
  content: Record<string, any>;
}
