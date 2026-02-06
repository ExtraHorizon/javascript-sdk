import {
  ObjectId,
  LanguageCode,
  TimeZone,
  PagedResult,
  AffectedRecords,
  OptionsWithRql,
  OptionsBase,
} from '../types';

export interface TemplateV2 extends TemplateV2Creation {
  id: ObjectId;
  creationTimestamp: Date;
  updateTimestamp: Date;
}

export interface TemplateV2Creation {
  name: string;
  description?: string;
  properties?: Record<string, TypeConfiguration>;
  outputs: Record<string, string>;
}

export type TemplateV2ResolveOut = Record<string, string>;

export type TypeConfiguration = ObjectConfiguration | ArrayConfiguration |
    StringConfiguration | NumberConfiguration | BooleanConfiguration;

export interface ObjectConfiguration {
  type: 'object';
  properties: Record<string, TypeConfiguration>;
}

export interface ArrayConfiguration {
  type: 'array';
  items: TypeConfiguration;
}

export interface StringConfiguration {
  type: 'string';
}

export interface NumberConfiguration {
  type: 'number';
}

export interface BooleanConfiguration {
  type: 'boolean';
}

export interface TemplateV2ResolveIn {
  /**
   * If not present (or empty) we will first check the configured language in the users-service. If that is not present it will default to 'EN'
   */
  language?: LanguageCode;
  /**
   * If not present (or empty) we will first check the configured time_zone in the users-service. If that is not present it will default to 'UTC'
   */
  timeZone?: TimeZone;
  data?: Record<string, any>;
}

export interface TemplatesV2ErrorInfo {
  /**
   * The template outputs key in the request body that resulted in an error
   */
  output: string;
  /**
   * Error message describing the syntax error
   */
  message: string;
}

export interface TemplatesV2Service {
  /**
   * Get all templates the service has to offer
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<TemplateV2>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<TemplateV2>>;
  /**
   * Request a list of all templates
   *
   * Do not pass in a rql with limit operator!
   *
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   * @param rql Add filters to the requested list.
   * @returns TemplateV2[]
   */
  findAll(options?: OptionsWithRql): Promise<TemplateV2[]>;
  /**
   * Find By Id
   * @param id the Id to search for
   * @returns the first element found
   */
  findById(id: ObjectId, options?: OptionsWithRql): Promise<TemplateV2 | undefined>;
  /**
   * Find By Name
   * @param name the name to search for
   * @returns the first element found
   */
  findByName(name: string, options?: OptionsWithRql): Promise<TemplateV2 | undefined>;
  /**
   * Find First
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<TemplateV2 | undefined>;
  /**
   * Create a new template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param requestBody TemplateIn
   * @returns TemplateV2
   * @throws {ResourceAlreadyExistsError}
   * @throws {TemplateSyntaxError}
   */
  create(requestBody: TemplateV2Creation, options?: OptionsBase): Promise<TemplateV2>;
  /**
   * Update an existing template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param templateIdOrName Id or Name of the targeted template
   * @param requestBody TemplateIn
   * @returns TemplateV2
   * @throws {ResourceAlreadyExistsError}
   * @throws {TemplateSyntaxError}
   * @throws {ResourceUnknownError}
   */
  update(
    templateIdOrName: string,
    requestBody: Partial<TemplateV2Creation>,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
  /**
   * Delete a template
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_TEMPLATES` | `global` | **Required** for this endpoint
   * @param templateIdOrName Id or Name of the targeted template
   * @returns AffectedRecords
   * @throws {ResourceUnknownError}
   */
  remove(templateIdOrName: string, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Resolves a template and presents the result as a json response
   * Permission is **required** for this endpoint
   * Permission | Scope | Effect
   * - | - | -
   * `RESOLVE_TEMPLATES` | `global` | Resolve any template
   * `RESOLVE_TEMPLATES:{TEMPLATE_NAME}` | `global` | Resolve the specified template
   *
   * @param templateIdOrName Id or Name of the targeted template
   * @param requestBody CreateFile
   * @returns TemplateV2ResolveOut
   * @throws {TemplateResolvingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  resolve(
      templateIdOrName: string,
      requestBody: TemplateV2ResolveIn,
      options?: OptionsBase
  ): Promise<TemplateV2ResolveOut>;
}
