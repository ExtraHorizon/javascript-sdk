import {
  ObjectId,
  LanguageCode,
  TimeZone,
  PagedResult,
  AffectedRecords,
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
  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  health(this: TemplatesService): Promise<boolean>;
  /**
   * Get all templates the service has to offer
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<TemplateOut>
   */
  find(
    this: TemplatesService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<TemplateOut>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findById(
    this: TemplatesService,
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut>;
  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findByName(
    this: TemplatesService,
    name: string,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(
    this: TemplatesService,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut>;
  /**
   * Create a new template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param requestBody TemplateIn
   * @returns TemplateOut
   */
  create(this: TemplatesService, requestBody: TemplateIn): Promise<TemplateOut>;
  /**
   * Update an existing template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param templateId Id of the targeted template
   * @param requestBody TemplateIn
   * @returns TemplateOut
   * @throws {ResourceUnknownError}
   */
  update(
    this: TemplatesService,
    templateId: string,
    requestBody: TemplateIn
  ): Promise<TemplateOut>;
  /**
   * Delete a template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param templateId Id of the targeted template
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(this: TemplatesService, templateId: string): Promise<AffectedRecords>;
  /**
   * Resolves a template and presents the result as a pdf file
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param templateId Id of the targeted template
   * @param requestBody The file data
   * @returns Buffer
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  resolveAsPdf(
    this: TemplatesService,
    templateId: string,
    requestBody: CreateFile
  ): Promise<Buffer>;
  /**
   * @deprecated
   * Resolves a template and presents the result as a pdf file
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param templateId Id of the targeted template
   * @param localizationCode Specifies the language the template must be resolved in
   * @param requestBody The file data
   * @returns Buffer
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  resolveAsPdfUsingCode(
    this: TemplatesService,
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Buffer>;
  /**
   * Resolves a template and presents the result as a json response
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param templateId Id of the targeted template
   * @param requestBody CreateFile
   * @returns Record<string, string>
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  resolveAsJson(
    this: TemplatesService,
    templateId: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>>;
  /**
   * @deprecated
   * Resolves a template and presents the result as a json response
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param templateId Id of the targeted template
   * @param localizationCode Specifies the language the template must be resolved in
   * @param requestBody CreateFile
   * @returns Record<string, string>
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  resolveAsJsonUsingCode(
    this: TemplatesService,
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>>;
}
