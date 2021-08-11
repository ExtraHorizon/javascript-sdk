import { RQLString } from '../../rql';
import {
  AffectedRecords,
  OptionsBase,
  OptionsWithRql,
  PagedResult,
} from '../types';

export enum SupportedLanguageCodes {
  EN = 'EN',
  NL = 'NL',
  DE = 'DE',
  FR = 'FR',
  DA = 'DA',
  ES = 'ES',
  IT = 'IT',
}

type SupportedLanguageCodesValues = keyof typeof SupportedLanguageCodes;

export type MappedText = Record<SupportedLanguageCodesValues, string>;

export interface Localization {
  key: string;
  text: {
    [K in SupportedLanguageCodesValues]?: string;
  };
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface BulkLocalization {
  localizations?: Array<Pick<Localization, 'key' | 'text'>>;
}

/**
 * The 'created' field shows how many new localizations were succesfully created. The 'existing' field shows how many localizations with the given keys already existed. Eventually, the 'existing_ids' fields shows exactly which localizations already existed. Old localizations will not be overwritten by new ones.
 */
export interface BulkCreationResponse {
  created?: number;
  existing?: number;
  existingIds?: string[];
}

/**
 * The 'updated' field shows how many localizations were succesfully updated. The 'missing' field shows how many localizations with the given keys couldn't be found. Eventually, the 'missing_ids' fields shows exactly which localizations couldn't be found and are thus not updated.
 */
export interface BulkUpdateResponse {
  updated?: number;
  missing?: number;
  missingIds?: string[];
}

export interface LocalizationRequest {
  localizationCodes: SupportedLanguageCodesValues[];
  localizations: string[];
}

export interface CountriesService {
  /**
   * Retrieve a list of all the defined countries
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns PagedResult<string>
   */
  getCountries(options?: OptionsBase): Promise<string[]>;
  /**
   * Retrieve a list of all the defined regions for the specified country code
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param country The country code (as defined in ISO 3166-1)
   * @returns PagedResult<string>
   * @throws {ResourceUnknownError}
   */
  getRegions(country: string, options?: OptionsBase): Promise<string[]>;
}

export interface LanguagesService {
  /**
   * Retrieve a list of all the defined languages
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @returns PagedResult<SupportedLanguageCodes>
   */
  getLanguages(options?: OptionsBase): Promise<string[]>;
}

export interface LocalizationsService {
  /**
   * Returns all possible localizations stored in this service
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param rql Add filters to the requested list.
   * @returns PagedResult<Localization>
   */
  find(options?: OptionsWithRql): Promise<PagedResult<Localization>>;
  /**
   * Find By Key
   * @param key the key to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  findByKey(key: string, options?: OptionsWithRql): Promise<Localization>;
  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  findFirst(options?: OptionsWithRql): Promise<Localization>;
  /**
   * Create new localizations
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_LOCALIZATIONS` | global | **Required** for this endpoint
   * @param requestBody BulkLocalization
   * @returns BulkCreationResponse
   * @throws {DefaultLocalizationMissingError}
   */
  create(
    requestBody: BulkLocalization,
    options?: OptionsBase
  ): Promise<BulkCreationResponse>;
  /**
   * Update localizations
   *
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_LOCALIZATIONS` | global | **Required** for this endpoint
   * @param requestBody BulkLocalization
   * @returns BulkUpdateResponse
   */
  update(
    requestBody: BulkLocalization,
    options?: OptionsBase
  ): Promise<BulkUpdateResponse>;
  /**
   * Delete localizations
   *
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_LOCALIZATIONS` | global | **Required** for this endpoint
   * @param rql Add filters to the requested list, **required**.
   * @returns AffectedRecords
   */
  remove(rql: RQLString, options?: OptionsBase): Promise<AffectedRecords>;
  /**
   * Request localizations of multiple keys in a specific language
   * The default language (EN) is always included in the response as a fallback in case there is no translation available for the specified language
   *
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   * @param requestBody LocalizationRequest
   * @returns Record<string, MappedText>
   */
  getByKeys(
    requestBody: LocalizationRequest,
    options?: OptionsBase
  ): Promise<Record<string, MappedText>>;
}
