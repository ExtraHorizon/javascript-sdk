import { FindAllIterator } from '../../services/helpers';
import {
  ObjectId,
  LanguageCode,
  TimeZone,
  PagedResult,
  AffectedRecords,
  OptionsWithRql,
  OptionsBase,
} from '../types';

// Legacy, before we exported these types with these names
export type TemplateOut = Template;
export type TemplateIn = TemplateCreation;

export interface Template {
  id: ObjectId;
  name: string;
  description: string;
  schema: TemplateObjectConfiguration;
  fields: Record<string, string>;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface TemplateCreation {
  name: string;
  description: string;
  schema: TemplateObjectConfiguration;
  fields: Record<string, string>;
}

export type TemplateTypeConfiguration =
    TemplateObjectConfiguration |
    TemplateArrayConfiguration |
    TemplateStringConfiguration |
    TemplateNumberConfiguration |
    TemplateBooleanConfiguration |
    TemplateObjectIdConfiguration |
    TemplateDateConfiguration;

export interface TemplateObjectConfiguration {
  type: 'object';
  fields?: Record<string, TemplateTypeConfiguration>;
  options?: TemplateObjectOption[];
}

export interface TemplateArrayConfiguration {
  type: 'array';
  options?: TemplateArrayOption[];
}

export interface TemplateStringConfiguration {
  type: 'string';
  options?: TemplateStringOption[];
}

export interface TemplateNumberConfiguration {
  type: 'number';
  options?: TemplateNumberOption[];
}

export interface TemplateBooleanConfiguration {
  type: 'boolean';
}

export interface TemplateObjectIdConfiguration {
  type: 'object_id';
}

export interface TemplateDateConfiguration {
  type: 'date';
  options?: TemplateDateOption[];
}

export type TemplateObjectOption =
    TemplateObjectMinBytesOption |
    TemplateObjectMaxBytesOption;

export type TemplateObjectMinBytesOption = TemplateTypeOption<'min_bytes', number>;
export type TemplateObjectMaxBytesOption = TemplateTypeOption<'max_bytes', number>;

export type TemplateNumberOption =
    TemplateNumberInOption |
    TemplateNumberMaxOption |
    TemplateNumberMaxSizeOption |
    TemplateNumberMinOption |
    TemplateNumberMinSizeOption |
    TemplateNumberSizeOption;

export type TemplateNumberInOption = TemplateTypeOption<'in', number[]>;
export type TemplateNumberMaxOption = TemplateTypeOption<'max', number>;
export type TemplateNumberMaxSizeOption = TemplateTypeOption<'max_size', number>;
export type TemplateNumberMinOption = TemplateTypeOption<'min', number>;
export type TemplateNumberMinSizeOption = TemplateTypeOption<'min_size', number>;
export type TemplateNumberSizeOption = TemplateTypeOption<'size', number>;

export type TemplateArrayOption =
    TemplateArrayMaxSizeOption |
    TemplateArrayMinSizeOption |
    TemplateArraySizeOption;

export type TemplateArrayMaxSizeOption = TemplateTypeOption<'max_size', number>;
export type TemplateArrayMinSizeOption = TemplateTypeOption<'min_size', number>;
export type TemplateArraySizeOption = TemplateTypeOption<'size', number>;

export type TemplateStringOption =
    TemplateStringInOption |
    TemplateStringMaxSizeOption |
    TemplateStringMinSizeOption |
    TemplateStringRegexOption |
    TemplateStringSizeOption;

export type TemplateStringInOption = TemplateTypeOption<'in', string[]>;
export type TemplateStringRegexOption = TemplateTypeOption<'regex', string>;
export type TemplateStringMaxSizeOption = TemplateTypeOption<'max_size', number>;
export type TemplateStringMinSizeOption = TemplateTypeOption<'min_size', number>;
export type TemplateStringSizeOption = TemplateTypeOption<'size', number>;

export type TemplateDateOption =
    TemplateDateMaxOption |
    TemplateDateMinOption;

export type TemplateDateMaxOption = TemplateTypeOption<'max', number>;
export type TemplateDateMinOption = TemplateTypeOption<'min', number>;

interface TemplateTypeOption<T, V> {
  type: T;
  value: V;
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
  find(options?: OptionsWithRql): Promise<PagedResult<Template>>;
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
  findAll(options?: OptionsWithRql): Promise<Template[]>;
  /**
   * Request a list of all templates
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns TemplateOut[]
   */
  findAllIterator(options?: OptionsWithRql): FindAllIterator<Template>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<Template | undefined>;
  /**
   * Find By Name
   * @param name the name to search for
   * @returns the first element found
   */
  findByName(name: string, options?: OptionsWithRql): Promise<Template | undefined>;
  /**
   * Find First
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Template | undefined>;
  /**
   * Create a new template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param requestBody TemplateIn
   * @returns TemplateOut
   */
  create(requestBody: TemplateCreation, options?: OptionsBase): Promise<Template>;
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
    requestBody: TemplateCreation,
    options?: OptionsBase
  ): Promise<Template>;
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
