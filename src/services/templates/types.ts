import {
  ObjectId,
  LanguageCode,
  TimeZone,
  PagedResult,
  AffectedRecords,
  OptionsWithRql,
  OptionsBase,
} from '../types';
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

export interface TemplatesService {
  /**
   * Perform a health check
   * @returns {boolean} success
   */
  health(): Promise<boolean>;
  /**
   * Get all templates the service has to offer
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<TemplateOut>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<TemplateOut>>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  /**
   * Request a list of all templates
   *
   * Do not pass in an rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns TemplateOut[]
   */
  findAll(options?: OptionsWithRql): Promise<TemplateOut[]>;
  /**
   * Request a list of all templates
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns TemplateOut[]
   */
  findAllIterator(
    options?: OptionsWithRql
  ): AsyncGenerator<PagedResult<TemplateOut>, Record<string, never>, void>;
  findById(id: ObjectId, options?: OptionsWithRql): Promise<TemplateOut>;
  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findByName(name: string, options?: OptionsWithRql): Promise<TemplateOut>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<TemplateOut>;
  /**
   * Create a new template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param requestBody TemplateIn
   * @returns TemplateOut
   */
  create(requestBody: TemplateIn, options?: OptionsBase): Promise<TemplateOut>;
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
    templateId: string,
    requestBody: TemplateIn,
    options?: OptionsBase
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
  remove(templateId: string, options?: OptionsBase): Promise<AffectedRecords>;
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
    templateId: string,
    requestBody: CreateFile,
    options?: OptionsBase
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
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile,
    options?: OptionsBase
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
    templateId: string,
    requestBody: CreateFile,
    options?: OptionsBase
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
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile,
    options?: OptionsBase
  ): Promise<Record<string, string>>;
}
