export type Key = string;
/**
 * Strings mapped to a language code
 */
export type MappedText = Record<string, string>;
export type StringArray = Array<Key>;

export enum SupportedLanguageCodes {
  NL = 'NL',
  EN = 'EN',
  DE = 'DE',
  FR = 'FR',
}

export interface Localization {
  key?: Key;
  text?: MappedText;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface BulkLocalizationBean {
  localizations?: Array<LocalizationBean>;
}

export interface LocalizationBean {
  key?: Key;
  text?: MappedText;
}

/**
 * The 'created' field shows how many new localizations were succesfully created. The 'existing' field shows how many localizations with the given keys already existed. Eventually, the 'existing_ids' fields shows exactly which localizations already existed. Old localizations will not be overwritten by new ones.
 */
export interface BulkCreationResponseBean {
  created?: number;
  existing?: number;
  existingIds?: StringArray;
}

/**
 * The 'updated' field shows how many localizations were succesfully updated. The 'missing' field shows how many localizations with the given keys couldn't be found. Eventually, the 'missing_ids' fields shows exactly which localizations couldn't be found and are thus not updated.
 */
export interface BulkUpdateResponseBean {
  updated?: number;
  missing?: number;
  missingIds?: StringArray;
}

export interface LocalizationRequestBean {
  localizationCodes?: Array<SupportedLanguageCodes>;
  localizations?: StringArray;
}
