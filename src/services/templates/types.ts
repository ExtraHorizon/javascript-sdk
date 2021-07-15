import {
  ObjectId,
  LanguageCode,
  TimeZone,
  AffectedRecords,
  PagedResult,
} from '../types';
import { TypeConfiguration } from '../data/types';
import { RQLString } from '../../rql';

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

export interface TemplatesService {
  health(this: TemplatesService): Promise<boolean>;
  find(
    this: TemplatesService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<TemplateOut>>;
  findById(
    this: TemplatesService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut>;
  findByName(
    this: TemplatesService,
    name: string,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut>;
  findFirst(
    this: TemplatesService,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut>;
  create(this: TemplatesService, requestBody: TemplateIn): Promise<TemplateOut>;
  update(
    this: TemplatesService,
    templateId: string,
    requestBody: TemplateIn
  ): Promise<TemplateOut>;
  remove(this: TemplatesService, templateId: string): Promise<AffectedRecords>;
  resolveAsPdf(
    this: TemplatesService,
    templateId: string,
    requestBody: CreateFile
  ): Promise<Buffer>;
  resolveAsPdfUsingCode(
    this: TemplatesService,
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Buffer>;
  resolveAsJson(
    this: TemplatesService,
    templateId: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>>;
  resolveAsJsonUsingCode(
    this: TemplatesService,
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>>;
}
