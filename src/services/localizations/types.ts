import { RQLString } from '../../rql';
import { AffectedRecords, PagedResult } from '../types';

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
  getCountries(this: CountriesService): Promise<string[]>;
  getRegions(this: CountriesService, country: string): Promise<string[]>;
}

export interface LanguagesService {
  getLanguages(this: LanguagesService): Promise<string[]>;
}

export interface LocalizationsService {
  find(
    this: LocalizationsService,
    options?: { rql?: RQLString }
  ): Promise<PagedResult<Localization>>;
  findByKey(
    this: LocalizationsService,
    key: string,
    options?: { rql?: RQLString }
  ): Promise<Localization>;
  findFirst(
    this: LocalizationsService,
    options?: { rql?: RQLString }
  ): Promise<Localization>;
  create(
    this: LocalizationsService,
    requestBody: BulkLocalization
  ): Promise<BulkCreationResponse>;
  update(
    this: LocalizationsService,
    requestBody: BulkLocalization
  ): Promise<BulkUpdateResponse>;
  remove(this: LocalizationsService, rql: RQLString): Promise<AffectedRecords>;
  getByKeys(
    this: LocalizationsService,
    requestBody: LocalizationRequest
  ): Promise<Record<string, MappedText>>;
}
