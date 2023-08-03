import { AffectedRecords, OptionsBase } from '../../types';

export interface FileServiceSettingsService {
  /**
   * ## Retrieve the File Service settings
   *
   *  ** Global Permissions: **
   *  - `VIEW_FILE_SERVICE_SETTINGS` - **Required** for this endpoint
   *
   * @param options {@link OptionsBase} - Additional options for the request
   * @returns {@link FileServiceSettings} - The File Service settings
   */
  get(options?: OptionsBase): Promise<FileServiceSettings>;

  /**
   * ## Update the File Service settings
   *
   *  ** Global Permissions: **
   *  - `UPDATE_FILE_SERVICE_SETTINGS` - **Required** for this endpoint
   *
   * @param data {@link FileServiceSettingsUpdate} - The File Service settings to be updated
   * @param options {@link OptionsBase} - Additional options for the request
   * @returns {@link AffectedRecords } - A response detailing the number of records affected by the request
   */
  update(
    data: Partial<FileServiceSettingsUpdate>,
    options?: OptionsBase
  ): Promise<AffectedRecords>;
}

export interface FileServiceSettingsUpdate {
  disableForceDownloadForMimeTypes: string[];
}

export interface FileServiceSettings {
  /**
   * All files will have a Content-Disposition header with the Attachment value when fetched, unless their MIME type matches a type in this array exactly.
   *
   * The Attachment value ensures files are downloaded rather than displayed directly in the browser, enhancing protection against potential XSS vulnerabilities.
   *
   * The value *\/\* can be used to allow any file to be displayed by browsers, use at your own discretion.
   */
  disableForceDownloadForMimeTypes: string[];
  updateTimestamp: Date;
}
